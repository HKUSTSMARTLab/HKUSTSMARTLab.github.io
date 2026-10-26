import { readFileSync } from "node:fs";
import { isIP } from "node:net";

const TURNSTILE_TEST_KEYS = new Set([
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000FF",
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);
const EXAMPLE_ADMIN_TOKEN = "replace-with-at-least-32-random-characters";

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function parseInteger(value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`Invalid integer value: ${value}`);
  }
  return parsed;
}

function parseList(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDate(value, name) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(`${name} must be an ISO 8601 date`);
  return { iso: new Date(timestamp).toISOString(), timestamp };
}

/** Load a small, dependency-free .env file without overriding process env vars. */
export function loadEnvFile(path) {
  let contents;
  try {
    contents = readFileSync(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const [index, rawLine] of contents.split(/\r?\n/u).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) throw new Error(`Invalid .env syntax at line ${index + 1}`);
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || "production";
  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }
  const production = nodeEnv === "production";
  const turnstileEnabled = parseBoolean(env.TURNSTILE_ENABLED, true);
  const aliyunEnabled = parseBoolean(env.ALIYUN_CAPTCHA_ENABLED, false);
  const captchaProvider = env.CAPTCHA_PROVIDER || "auto";

  if (!["auto", "turnstile", "aliyun"].includes(captchaProvider)) {
    throw new Error("CAPTCHA_PROVIDER must be auto, turnstile, or aliyun");
  }
  if (!turnstileEnabled && !aliyunEnabled) {
    throw new Error("At least one CAPTCHA provider must be enabled");
  }
  if (captchaProvider === "turnstile" && !turnstileEnabled) {
    throw new Error("CAPTCHA_PROVIDER=turnstile requires TURNSTILE_ENABLED=true");
  }
  if (captchaProvider === "aliyun" && !aliyunEnabled) {
    throw new Error("CAPTCHA_PROVIDER=aliyun requires ALIYUN_CAPTCHA_ENABLED=true");
  }
  if (turnstileEnabled && (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY)) {
    throw new Error("Turnstile requires both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY");
  }
  const aliyunRegion = env.ALIYUN_CAPTCHA_REGION || "cn";
  if (!["cn", "sgp"].includes(aliyunRegion)) {
    throw new Error("ALIYUN_CAPTCHA_REGION must be cn or sgp");
  }
  const defaultAliyunEndpoint = aliyunRegion === "cn"
    ? "captcha.cn-shanghai.aliyuncs.com"
    : "captcha.ap-southeast-1.aliyuncs.com";
  const aliyunEndpoint = (env.ALIYUN_CAPTCHA_ENDPOINT || defaultAliyunEndpoint).toLowerCase();
  if (!/^[a-z0-9.-]+\.aliyuncs\.com$/u.test(aliyunEndpoint)) {
    throw new Error("ALIYUN_CAPTCHA_ENDPOINT must be an Alibaba Cloud captcha endpoint hostname");
  }
  if (aliyunEnabled && (!env.ALIYUN_CAPTCHA_PREFIX || !env.ALIYUN_CAPTCHA_SCENE_ID)) {
    throw new Error("Aliyun Captcha requires ALIYUN_CAPTCHA_PREFIX and ALIYUN_CAPTCHA_SCENE_ID");
  }
  if (aliyunEnabled && (!env.ALIYUN_ACCESS_KEY_ID || !env.ALIYUN_ACCESS_KEY_SECRET)) {
    throw new Error("Aliyun Captcha requires RAM AccessKey credentials");
  }

  const turnstileTestKeys = TURNSTILE_TEST_KEYS.has(env.TURNSTILE_SITE_KEY) || TURNSTILE_TEST_KEYS.has(env.TURNSTILE_SECRET_KEY);
  if (production && turnstileEnabled && turnstileTestKeys) {
    throw new Error("Production refuses Cloudflare Turnstile test keys");
  }
  const turnstileHostnames = parseList(env.TURNSTILE_EXPECTED_HOSTNAMES).map((host) => host.toLowerCase());
  if (production && turnstileEnabled && turnstileHostnames.length === 0) {
    throw new Error("Production requires TURNSTILE_EXPECTED_HOSTNAMES");
  }

  const adminToken = env.ADMIN_API_TOKEN || "";
  if (production && (adminToken.length < 32 || adminToken === EXAMPLE_ADMIN_TOKEN)) {
    throw new Error("Production requires a unique ADMIN_API_TOKEN of at least 32 characters");
  }

  const allowedOrigins = parseList(env.ALLOWED_ORIGINS || [
    "https://hkustsmartlab.github.io",
    "http://127.0.0.1:4000",
    "http://localhost:4000",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:8787",
    "http://localhost:8787",
  ].join(","));
  const trustProxy = parseInteger(env.TRUST_PROXY, 0, { min: 0, max: 5 });
  const trustedProxyIps = parseList(env.TRUST_PROXY_IPS || (trustProxy > 0 ? "127.0.0.1,::1" : ""));
  if (trustedProxyIps.some((ip) => !isIP(ip))) {
    throw new Error("TRUST_PROXY_IPS must contain exact IP addresses, not hostnames or CIDRs");
  }
  const geoProvider = env.GEO_PROVIDER || "none";
  if (!["none", "cloudflare", "edgeone", "apnic"].includes(geoProvider)) {
    throw new Error("GEO_PROVIDER must be none, cloudflare, edgeone, or apnic");
  }
  const defaultCountryHeader = geoProvider === "cloudflare" ? "cf-ipcountry" : "eo-client-ipcountry";
  const countryHeader = (env.GEO_COUNTRY_HEADER || defaultCountryHeader).toLowerCase();
  if (!/^[a-z0-9-]+$/u.test(countryHeader)) {
    throw new Error("GEO_COUNTRY_HEADER contains invalid characters");
  }

  return {
    nodeEnv,
    production,
    host: env.HOST || "127.0.0.1",
    port: parseInteger(env.PORT, 8787, { min: 1, max: 65535 }),
    serveStatic: parseBoolean(env.SERVE_STATIC, true),
    allowedOrigins,
    trustProxy,
    trustedProxyIps,
    geo: {
      provider: geoProvider,
      countryHeader,
    },
    maxConnections: parseInteger(env.MAX_CONNECTIONS, 500, { min: 10, max: 100000 }),
    retentionDays: parseInteger(env.RETENTION_DAYS, 180, { min: 1, max: 3650 }),
    pdfMaxBytes: parseInteger(env.PDF_MAX_BYTES, 5 * 1024 * 1024, { min: 1024, max: 5 * 1024 * 1024 }),
    uploadTokenTtlMs: parseInteger(env.UPLOAD_TOKEN_TTL_MS, 15 * 60 * 1000, { min: 60000, max: 3600000 }),
    requestTimeoutMs: parseInteger(env.REQUEST_TIMEOUT_MS, 120000, { min: 15000, max: 180000 }),
    registrationOpen: parseBoolean(env.REGISTRATION_OPEN, true),
    conferenceDeadline: parseDate(env.CONFERENCE_DEADLINE, "CONFERENCE_DEADLINE"),
    posterDeadline: parseDate(env.POSTER_DEADLINE || "2026-11-13T23:59:59+08:00", "POSTER_DEADLINE"),
    captchaProvider,
    turnstile: {
      enabled: turnstileEnabled,
      siteKey: env.TURNSTILE_SITE_KEY || "",
      secretKey: env.TURNSTILE_SECRET_KEY || "",
      expectedHostnames: turnstileHostnames,
      testMode: !production && turnstileTestKeys,
    },
    aliyun: {
      enabled: aliyunEnabled,
      region: aliyunRegion,
      prefix: env.ALIYUN_CAPTCHA_PREFIX || "",
      sceneId: env.ALIYUN_CAPTCHA_SCENE_ID || "",
      accessKeyId: env.ALIYUN_ACCESS_KEY_ID || "",
      accessKeySecret: env.ALIYUN_ACCESS_KEY_SECRET || "",
      securityToken: env.ALIYUN_SECURITY_TOKEN || "",
      endpoint: aliyunEndpoint,
    },
    adminToken,
    debugAdminEnabled: parseBoolean(env.DEBUG_ADMIN_ENABLED, !production),
    debugCaptchaBypass: parseBoolean(env.DEBUG_ALLOW_CAPTCHA_BYPASS, false),
    bodyLimit: parseInteger(env.BODY_LIMIT_BYTES, 32768, { min: 4096, max: 131072 }),
    captchaTimeoutMs: parseInteger(env.CAPTCHA_TIMEOUT_MS, 5000, { min: 1000, max: 15000 }),
    captchaConcurrency: parseInteger(env.CAPTCHA_MAX_CONCURRENCY, 20, { min: 1, max: 100 }),
    rateLimit: {
      windowMs: parseInteger(env.RATE_LIMIT_WINDOW_MS, 60000, { min: 1000, max: 3600000 }),
      apiPerWindow: parseInteger(env.RATE_LIMIT_API_PER_WINDOW, 120, { min: 10, max: 10000 }),
      submitWindowMs: parseInteger(env.RATE_LIMIT_SUBMIT_WINDOW_MS, 600000, { min: 10000, max: 86400000 }),
      submitPerWindow: parseInteger(env.RATE_LIMIT_SUBMIT_PER_WINDOW, 10, { min: 2, max: 1000 }),
      maxEntries: parseInteger(env.RATE_LIMIT_MAX_ENTRIES, 10000, { min: 100, max: 100000 }),
    },
  };
}
