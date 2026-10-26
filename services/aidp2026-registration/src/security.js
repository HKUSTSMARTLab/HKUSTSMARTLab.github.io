import { isIP } from "node:net";
import { createHash, timingSafeEqual } from "node:crypto";
import { HttpError } from "./validation.js";

function normalizeIp(value) {
  if (!value) return null;
  const ip = String(value).trim().replace(/^::ffff:/u, "");
  return isIP(ip) ? ip : null;
}

export function isTrustedProxyPeer(request, trustProxy = 0, trustedProxyIps = []) {
  const peer = normalizeIp(request.socket.remoteAddress) || "unknown";
  return trustProxy > 0 && trustedProxyIps.includes(peer);
}

export function clientIp(request, trustProxy = 0, trustedProxyIps = []) {
  const peer = normalizeIp(request.socket.remoteAddress) || "unknown";
  if (isTrustedProxyPeer(request, trustProxy, trustedProxyIps)) {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const hops = forwarded.split(",").map((part) => normalizeIp(part)).filter(Boolean);
      if (hops.length > 0) return hops[Math.max(0, hops.length - trustProxy)] || hops[0];
    }
  }
  return peer;
}

export function edgeCountry(request, config) {
  if (config.geo.provider === "none" || !isTrustedProxyPeer(request, config.trustProxy, config.trustedProxyIps)) return null;
  const value = request.headers[config.geo.countryHeader];
  if (typeof value !== "string" || !/^[a-z]{2}$/iu.test(value)) return null;
  const country = value.toUpperCase();
  return ["XX", "T1"].includes(country) ? null : country;
}

export function isLoopback(request) {
  const ip = normalizeIp(request.socket.remoteAddress);
  return ip === "127.0.0.1" || ip === "::1";
}

export function isAdmin(request, configuredToken) {
  if (!configuredToken) return false;
  const authorization = request.headers.authorization;
  if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) return false;
  const provided = authorization.slice(7);
  if (provided.length > 512) return false;
  const expectedDigest = createHash("sha256").update(configuredToken).digest();
  const providedDigest = createHash("sha256").update(provided).digest();
  return timingSafeEqual(expectedDigest, providedDigest);
}

export function requireAdmin(request, config) {
  if (!isAdmin(request, config.adminToken)) {
    throw new HttpError(401, "UNAUTHORIZED", "Administrator authentication required.");
  }
}

export class RateLimiter {
  constructor({ maxEntries = 10000 } = {}) {
    this.entries = new Map();
    this.maxEntries = maxEntries;
  }

  check(key, { limit, windowMs }) {
    const now = Date.now();
    if (this.entries.size >= this.maxEntries) this.cleanup(now, true);
    if (this.entries.size >= this.maxEntries) {
      throw new HttpError(503, "RATE_LIMITER_BUSY", "The service is busy. Please try again shortly.");
    }

    let entry = this.entries.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      this.entries.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > limit) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      const error = new HttpError(429, "RATE_LIMITED", "Too many requests. Please wait before trying again.");
      error.retryAfter = retryAfter;
      throw error;
    }
  }

  cleanup(now = Date.now(), aggressive = false) {
    for (const [key, entry] of this.entries) {
      if (now >= entry.resetAt) this.entries.delete(key);
    }
    if (aggressive && this.entries.size >= this.maxEntries) {
      const excess = this.entries.size - Math.floor(this.maxEntries * 0.75);
      let removed = 0;
      for (const key of this.entries.keys()) {
        this.entries.delete(key);
        if (++removed >= excess) break;
      }
    }
  }

  get size() {
    return this.entries.size;
  }
}
