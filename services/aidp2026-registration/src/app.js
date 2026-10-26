import { createServer } from "node:http";
import { createReadStream, lstatSync, realpathSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { RegistrationStore } from "./database.js";
import { PosterFileStorage } from "./files.js";
import { createCaptchaVerifier } from "./captcha.js";
import { HttpError, validateSubmission } from "./validation.js";
import { clientIp, edgeCountry, isAdmin, isLoopback, RateLimiter, requireAdmin } from "./security.js";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".tex": "application/x-tex; charset=utf-8",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function securityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function sendJson(request, response, status, payload) {
  if (response.writableEnded) return;
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  response.end(request.method === "HEAD" ? undefined : body);
}

function applyCors(request, response, config) {
  const origin = request.headers.origin;
  if (!origin) return;
  const protocol = request.socket.encrypted ? "https" : "http";
  const ownOrigin = `${protocol}://${request.headers.host}`;
  if (!config.allowedOrigins.includes(origin) && origin !== ownOrigin) {
    throw new HttpError(403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed to use the registration service.");
  }
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
}

function readJson(request, limit) {
  const contentType = String(request.headers["content-type"] || "").split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
  }
  const declaredLength = Number(request.headers["content-length"] || 0);
  if (declaredLength > limit) throw new HttpError(413, "BODY_TOO_LARGE", "The submission is too large.");

  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    request.on("data", (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > limit) {
        settled = true;
        rejectBody(new HttpError(413, "BODY_TOO_LARGE", "The submission is too large."));
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (settled) return;
      settled = true;
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolveBody(JSON.parse(body));
      } catch {
        rejectBody(new HttpError(400, "INVALID_JSON", "The request body is not valid JSON."));
      }
    });
    request.on("error", (error) => {
      if (!settled) {
        settled = true;
        rejectBody(error);
      }
    });
  });
}

function idempotencyKey(request) {
  const key = request.headers["idempotency-key"];
  if (typeof key !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(key)) {
    throw new HttpError(400, "IDEMPOTENCY_KEY_REQUIRED", "A valid Idempotency-Key header is required.");
  }
  return key;
}

function createUploadToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: createHash("sha256").update(token).digest("hex") };
}

function uploadTokenMatches(token, storedHash) {
  if (typeof token !== "string" || token.length < 32 || token.length > 128 || typeof storedHash !== "string") return false;
  const provided = createHash("sha256").update(token).digest();
  const expected = Buffer.from(storedHash, "hex");
  return expected.length === provided.length && timingSafeEqual(provided, expected);
}

function publicConfig(config, country) {
  const now = Date.now();
  const conferenceOpen = config.registrationOpen && (!config.conferenceDeadline || now <= config.conferenceDeadline.timestamp);
  const posterOpen = !config.posterDeadline || now <= config.posterDeadline.timestamp;
  let preferredProvider = config.captchaProvider;
  if (preferredProvider === "auto" && country) {
    if (country === "CN" && config.tencent.enabled) preferredProvider = "tencent";
    else if (config.turnstile.enabled) preferredProvider = "turnstile";
    else if (config.tencent.enabled) preferredProvider = "tencent";
  }
  return {
    service: "aidp2026",
    retentionDays: config.retentionDays,
    registration: {
      open: conferenceOpen,
      deadline: config.conferenceDeadline?.iso || null,
    },
    posters: {
      open: posterOpen,
      deadline: config.posterDeadline?.iso || null,
      acceptanceNotification: "2026-11-16",
      maxPdfBytes: config.pdfMaxBytes,
    },
    captcha: {
      preferredProvider,
      turnstile: config.turnstile.enabled ? { siteKey: config.turnstile.siteKey } : null,
      tencent: config.tencent.enabled ? { appId: config.tencent.appId } : null,
    },
  };
}

function isOpen(config, kind) {
  const now = Date.now();
  if (kind === "conference") {
    return config.registrationOpen && (!config.conferenceDeadline || now <= config.conferenceDeadline.timestamp);
  }
  return !config.posterDeadline || now <= config.posterDeadline.timestamp;
}

function parseKind(value) {
  if (value === "registrations" || value === "conference") return "conference";
  if (value === "posters" || value === "poster") return "poster";
  return null;
}

function csvCell(value) {
  let text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  const formulaProbe = text.normalize("NFKC").replace(/^\s+/u, "");
  if (/^[=+\-@]/u.test(formulaProbe)) text = `'${text}`;
  return `"${text.replace(/"/gu, '""')}"`;
}

function sendCsv(request, response, rows) {
  const columns = ["id", "kind", "createdAt", "fullName", "email", "affiliation", "duplicateCount", "role", "dates", "title", "authors", "abstract", "topic", "uploadStatus", "pdfFileName", "pdfSize", "pdfSha256"];
  response.writeHead(200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": "attachment; filename=aidp2026-submissions.csv",
    "Cache-Control": "no-store",
  });
  if (request.method === "HEAD") return response.end();
  response.write(`\uFEFF${columns.map(csvCell).join(",")}\r\n`);
  for (const row of rows) response.write(`${columns.map((column) => csvCell(row[column])).join(",")}\r\n`);
  response.end();
}

function serveStatic(request, response, url, staticDirectory) {
  if (!["GET", "HEAD"].includes(request.method)) throw new HttpError(405, "METHOD_NOT_ALLOWED", "Method not allowed.");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    throw new HttpError(400, "INVALID_PATH", "Invalid path.");
  }
  if (pathname.includes("\0") || pathname.split("/").some((part) => part.startsWith("."))) {
    throw new HttpError(404, "NOT_FOUND", "Not found.");
  }

  let relative = pathname;
  if (relative === "/" || relative === "/conference/aidp2026" || relative === "/conference/aidp2026/") {
    relative = "index.html";
  } else {
    relative = relative.replace(/^\/conference\/aidp2026\/?/u, "").replace(/^\/+/, "");
  }
  const staticRoot = realpathSync(staticDirectory);
  const filePath = resolve(staticRoot, relative);
  if (!filePath.startsWith(`${staticRoot}${sep}`)) throw new HttpError(403, "INVALID_PATH", "Invalid path.");

  let stats;
  let servedPath;
  try {
    if (lstatSync(filePath).isSymbolicLink()) throw new Error("Symbolic link rejected");
    servedPath = realpathSync(filePath);
    if (!servedPath.startsWith(`${staticRoot}${sep}`)) throw new Error("Path escaped static root");
    stats = statSync(servedPath);
  } catch {
    throw new HttpError(404, "NOT_FOUND", "Not found.");
  }
  if (!stats.isFile()) throw new HttpError(404, "NOT_FOUND", "Not found.");
  const contentType = MIME_TYPES[extname(servedPath).toLowerCase()];
  if (!contentType) throw new HttpError(404, "NOT_FOUND", "Not found.");
  response.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stats.size,
    "Cache-Control": extname(servedPath) === ".html" ? "no-cache" : "public, max-age=3600",
  });
  if (request.method === "HEAD") return response.end();
  const stream = createReadStream(servedPath);
  stream.on("error", () => response.destroy());
  stream.pipe(response);
}

export function createRegistrationService({ config, dataDirectory, staticDirectory, verifyCaptcha }) {
  const store = new RegistrationStore(dataDirectory);
  const files = new PosterFileStorage(dataDirectory);
  const limiter = new RateLimiter(config.rateLimit);
  const activeUploads = new Set();
  const verify = verifyCaptcha || createCaptchaVerifier(config);
  function maintainStorage() {
    const expired = store.expiredSubmissionIds(config.retentionDays);
    store.purgeOlderThan(config.retentionDays);
    for (const id of expired) {
      if (!id.startsWith("AIDP26-P-")) continue;
      try {
        files.remove(id);
      } catch (error) {
        console.error(`Could not remove expired poster file ${id}:`, error.message);
      }
    }
    files.cleanup(store.allIds());
  }
  maintainStorage();
  const cleanupTimer = setInterval(() => limiter.cleanup(), 60000);
  const retentionTimer = setInterval(() => {
    try {
      maintainStorage();
    } catch (error) {
      console.error("Scheduled retention cleanup failed:", error.message);
    }
  }, 6 * 60 * 60 * 1000);
  cleanupTimer.unref();
  retentionTimer.unref();

  const server = createServer(async (request, response) => {
    const requestId = randomUUID();
    securityHeaders(response);
    response.setHeader("X-Request-Id", requestId);

    try {
      const url = new URL(request.url, "http://localhost");
      const isApi = url.pathname.startsWith("/api/aidp2026/");
      if (!isApi) {
        if (!config.serveStatic || !staticDirectory) throw new HttpError(404, "NOT_FOUND", "Not found.");
        serveStatic(request, response, url, staticDirectory);
        return;
      }

      const ip = clientIp(request, config.trustProxy, config.trustedProxyIps);
      limiter.check(`${ip}:api`, { limit: config.rateLimit.apiPerWindow, windowMs: config.rateLimit.windowMs });
      const adminRoute = url.pathname.startsWith("/api/aidp2026/admin/");
      if (adminRoute && request.headers.origin) {
        throw new HttpError(403, "ADMIN_CORS_DISABLED", "Administrator APIs do not allow browser cross-origin requests.");
      }
      applyCors(request, response, config);
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key, X-Upload-Token",
          "Access-Control-Max-Age": "600",
          "Cache-Control": "no-store",
        });
        response.end();
        return;
      }

      if (url.pathname === "/api/aidp2026/health" && ["GET", "HEAD"].includes(request.method)) {
        sendJson(request, response, 200, { ok: true, service: "aidp2026" });
        return;
      }
      if (url.pathname === "/api/aidp2026/config" && ["GET", "HEAD"].includes(request.method)) {
        response.setHeader("Vary", "Origin, CF-IPCountry, EO-Client-IPCountry");
        sendJson(request, response, 200, publicConfig(config, edgeCountry(request, config)));
        return;
      }

      const submissionMatch = url.pathname.match(/^\/api\/aidp2026\/(registrations|posters)$/u);
      if (submissionMatch && request.method === "POST") {
        const kind = parseKind(submissionMatch[1]);
        if (!isOpen(config, kind)) throw new HttpError(410, "SUBMISSIONS_CLOSED", "This submission channel is closed.");
        limiter.check(`${ip}:submit`, {
          limit: config.rateLimit.submitPerWindow,
          windowMs: config.rateLimit.submitWindowMs,
        });
        const body = await readJson(request, config.bodyLimit);
        const validated = validateSubmission(kind, body, { pdfMaxBytes: config.pdfMaxBytes });
        const key = idempotencyKey(request);
        const previous = store.findIdempotency(kind, key, validated.requestHash);
        if (previous?.conflict) throw new HttpError(409, "IDEMPOTENCY_CONFLICT", "This idempotency key was used for a different submission.");
        const debugBypass = config.debugAdminEnabled && config.debugCaptchaBypass && !config.production && config.trustProxy === 0
          && isLoopback(request) && isAdmin(request, config.adminToken) && request.headers["x-admin-debug"] === "bypass-captcha";
        if (!previous && !debugBypass) await verify(body.captcha, ip, `aidp2026-${kind}`);

        const result = previous || store.create(kind, validated.data, validated.dedupeKey, key, validated.requestHash);
        if (result.conflict) throw new HttpError(409, "IDEMPOTENCY_CONFLICT", "This idempotency key was used for a different submission.");
        if (kind === "poster") {
          const upload = createUploadToken();
          const expiresAt = new Date(Date.now() + config.uploadTokenTtlMs).toISOString();
          const session = store.replaceUploadSession(result.reference, upload.hash, expiresAt);
          if (!session) throw new HttpError(404, "NOT_FOUND", "Not found.");
          if (session.completed) {
            sendJson(request, response, 200, {
              ok: true,
              kind,
              reference: result.reference,
              replay: true,
              uploadRequired: false,
              message: "Poster PDF received for review.",
            });
            return;
          }
          sendJson(request, response, result.replay ? 200 : 202, {
            ok: true,
            kind,
            reference: result.reference,
            replay: Boolean(result.replay),
            uploadRequired: true,
            upload: {
              url: `/api/aidp2026/posters/${result.reference}/pdf`,
              token: upload.token,
              expiresAt,
              maxBytes: config.pdfMaxBytes,
            },
          });
          return;
        }
        sendJson(request, response, result.replay ? 200 : 201, {
          ok: true,
          kind,
          reference: result.reference,
          replay: Boolean(result.replay),
          message: "Conference registration received.",
        });
        return;
      }

      const uploadMatch = url.pathname.match(/^\/api\/aidp2026\/posters\/(AIDP26-P-[0-9A-F]{12})\/pdf$/u);
      if (uploadMatch && request.method === "POST") {
        const id = uploadMatch[1];
        if (!isOpen(config, "poster")) throw new HttpError(410, "SUBMISSIONS_CLOSED", "This submission channel is closed.");
        limiter.check(`${ip}:submit`, {
          limit: config.rateLimit.submitPerWindow,
          windowMs: config.rateLimit.submitWindowMs,
        });
        const session = store.uploadSession(id);
        if (!session) throw new HttpError(404, "UPLOAD_SESSION_NOT_FOUND", "Start the poster submission again to receive an upload link.");
        if (!uploadTokenMatches(request.headers["x-upload-token"], session.token_hash)) {
          throw new HttpError(401, "INVALID_UPLOAD_TOKEN", "The upload token is invalid. Restart the poster submission to receive a new one.");
        }
        if (session.details.pdf) {
          request.resume();
          sendJson(request, response, 200, {
            ok: true,
            kind: "poster",
            reference: id,
            replay: true,
            uploadRequired: false,
            message: "Poster PDF received for review.",
          });
          return;
        }
        if (Date.parse(session.expires_at) <= Date.now()) {
          throw new HttpError(410, "UPLOAD_SESSION_EXPIRED", "The upload link expired. Resubmit the poster details to receive a new link.");
        }
        if (activeUploads.has(id)) throw new HttpError(429, "UPLOAD_IN_PROGRESS", "This PDF is already being uploaded.");
        if (!session.details.expectedFile) throw new HttpError(400, "UPLOAD_NOT_REQUIRED", "This submission does not accept a PDF.");

        activeUploads.add(id);
        try {
          const uploaded = await files.save(request, {
            id,
            expectedSize: session.details.expectedFile.size,
            maxBytes: config.pdfMaxBytes,
          });
          let completed;
          try {
            completed = store.completePosterUpload(id, session.token_hash, {
              originalName: session.details.expectedFile.originalName,
              size: uploaded.size,
              sha256: uploaded.sha256,
            });
          } catch (error) {
            files.remove(id);
            throw error;
          }
          if (!completed || completed.tokenMismatch) {
            files.remove(id);
            throw new HttpError(409, "UPLOAD_SESSION_CHANGED", "The upload session changed. Restart the poster submission.");
          }
          sendJson(request, response, completed.replay ? 200 : 201, {
            ok: true,
            kind: "poster",
            reference: id,
            replay: completed.replay,
            uploadRequired: false,
            message: "Poster PDF received for review.",
          });
          return;
        } finally {
          activeUploads.delete(id);
        }
      }

      if (url.pathname.startsWith("/api/aidp2026/admin/")) {
        limiter.check(`${ip}:admin`, { limit: 30, windowMs: 300000 });
        requireAdmin(request, config);

        if (url.pathname === "/api/aidp2026/admin/debug") {
          if (!config.debugAdminEnabled || !["GET", "HEAD"].includes(request.method)) throw new HttpError(404, "NOT_FOUND", "Not found.");
          sendJson(request, response, 200, {
            ok: true,
            now: new Date().toISOString(),
            node: process.version,
            pid: process.pid,
            uptimeSeconds: Math.floor(process.uptime()),
            environment: config.nodeEnv,
            submissions: store.counts(),
            rateLimitEntries: limiter.size,
            captcha: {
              preferredProvider: config.captchaProvider,
              geoProvider: config.geo.provider,
              turnstileEnabled: config.turnstile.enabled,
              tencentEnabled: config.tencent.enabled,
              tencentVerifyMode: config.tencent.verifyMode,
            },
            debugCaptchaBypassAvailable: config.debugCaptchaBypass && !config.production && config.trustProxy === 0 && isLoopback(request),
          });
          return;
        }
        const downloadMatch = url.pathname.match(/^\/api\/aidp2026\/admin\/submissions\/(AIDP26-P-[0-9A-F]{12})\/pdf$/u);
        if (downloadMatch && ["GET", "HEAD"].includes(request.method)) {
          const id = downloadMatch[1];
          if (!store.posterFile(id)) throw new HttpError(404, "NOT_FOUND", "Not found.");
          const file = files.get(id);
          response.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Length": file.size,
            "Content-Disposition": `attachment; filename="${id}.pdf"`,
            "Cache-Control": "no-store",
          });
          if (request.method === "HEAD") return response.end();
          const stream = createReadStream(file.path);
          stream.on("error", () => response.destroy());
          stream.pipe(response);
          return;
        }
        if (url.pathname === "/api/aidp2026/admin/submissions" && ["GET", "HEAD"].includes(request.method)) {
          const kind = url.searchParams.has("kind") ? parseKind(url.searchParams.get("kind")) : undefined;
          if (url.searchParams.has("kind") && !kind) throw new HttpError(400, "INVALID_KIND", "Unknown submission kind.");
          const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit")) || 100));
          const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
          if (!Number.isSafeInteger(limit) || !Number.isSafeInteger(offset)) throw new HttpError(400, "INVALID_PAGINATION", "Invalid pagination.");
          sendJson(request, response, 200, { ok: true, ...store.list({ kind, limit, offset }) });
          return;
        }
        if (url.pathname === "/api/aidp2026/admin/export.csv" && ["GET", "HEAD"].includes(request.method)) {
          const kind = url.searchParams.has("kind") ? parseKind(url.searchParams.get("kind")) : undefined;
          if (url.searchParams.has("kind") && !kind) throw new HttpError(400, "INVALID_KIND", "Unknown submission kind.");
          const rows = store.all(kind);
          console.info(`[${requestId}] Administrator CSV export: kind=${kind || "all"}, rows=${rows.length}`);
          sendCsv(request, response, rows);
          return;
        }
      }

      throw new HttpError(404, "NOT_FOUND", "Not found.");
    } catch (error) {
      const known = error instanceof HttpError;
      const status = known ? error.status : 500;
      if (error.retryAfter) response.setHeader("Retry-After", String(error.retryAfter));
      if (!known) console.error(`[${requestId}] Unhandled request error:`, error);
      if (response.headersSent) {
        response.destroy();
        return;
      }
      sendJson(request, response, status, {
        ok: false,
        error: {
          code: known ? error.code : "INTERNAL_ERROR",
          message: known ? error.message : "The server could not process the request.",
          ...(known && error.fields ? { fields: error.fields } : {}),
          requestId,
        },
      });
    }
  });

  server.requestTimeout = config.requestTimeoutMs;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 1000;
  server.maxConnections = config.maxConnections;
  server.on("close", () => {
    clearInterval(cleanupTimer);
    clearInterval(retentionTimer);
    store.close();
  });
  return { server, store, files, limiter };
}
