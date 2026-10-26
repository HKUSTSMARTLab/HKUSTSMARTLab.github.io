import { createHash, createHmac } from "node:crypto";
import { HttpError } from "./validation.js";

function sha256(value, encoding = "hex") {
  return createHash("sha256").update(value).digest(encoding);
}

function hmac(key, value, encoding) {
  return createHmac("sha256", key).update(value).digest(encoding);
}

function captchaFailure(message = "Security verification failed. Please verify again.") {
  return new HttpError(400, "CAPTCHA_FAILED", message);
}

function captchaUnavailable() {
  return new HttpError(503, "CAPTCHA_UNAVAILABLE", "Security verification is temporarily unavailable. Try the other provider or try again shortly.");
}

async function responseJson(response) {
  if (!response.ok) throw captchaUnavailable();
  try {
    return await response.json();
  } catch {
    throw captchaUnavailable();
  }
}

async function verifyTurnstile(config, input, remoteIp, action, fetchImpl) {
  if (typeof input.token !== "string" || input.token.length < 1 || input.token.length > 2048) throw captchaFailure();
  const parameters = new URLSearchParams({
    secret: config.turnstile.secretKey,
    response: input.token,
  });
  if (remoteIp && remoteIp !== "unknown") parameters.set("remoteip", remoteIp);

  let result;
  try {
    const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: parameters,
      signal: AbortSignal.timeout(config.captchaTimeoutMs),
    });
    result = await responseJson(response);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw captchaUnavailable();
  }

  if (result.success !== true) throw captchaFailure();
  // Cloudflare's documented dummy response omits action. Real production
  // responses must bind the token to the exact conference/poster action.
  if (config.turnstile.testMode ? Boolean(result.action) && result.action !== action : result.action !== action) {
    throw captchaFailure();
  }
  const expectedHostnames = config.turnstile.expectedHostnames;
  if (expectedHostnames.length > 0 && !expectedHostnames.includes(String(result.hostname || "").toLowerCase())) {
    throw captchaFailure();
  }
}

function tencentCloudAuthorization(config, payload, timestamp) {
  const service = "captcha";
  const host = "captcha.tencentcloudapi.com";
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const algorithm = "TC3-HMAC-SHA256";
  const contentType = "application/json; charset=utf-8";
  const signedHeaders = "content-type;host";
  const canonicalRequest = [
    "POST",
    "/",
    "",
    `content-type:${contentType}\nhost:${host}\n`,
    signedHeaders,
    sha256(payload),
  ].join("\n");
  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = [algorithm, timestamp, credentialScope, sha256(canonicalRequest)].join("\n");
  const secretDate = hmac(`TC3${config.tencent.secretKey}`, date);
  const secretService = hmac(secretDate, service);
  const secretSigning = hmac(secretService, "tc3_request");
  const signature = hmac(secretSigning, stringToSign, "hex");
  return `${algorithm} Credential=${config.tencent.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

async function verifyTencentCurrent(config, input, remoteIp, fetchImpl) {
  const payload = JSON.stringify({
    CaptchaType: 9,
    Ticket: input.token,
    UserIp: remoteIp,
    Randstr: input.randstr,
    CaptchaAppId: Number(config.tencent.appId),
    AppSecretKey: config.tencent.appSecretKey,
  });
  const timestamp = Math.floor(Date.now() / 1000);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-TC-Action": "DescribeCaptchaResult",
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Version": "2019-07-22",
    Authorization: tencentCloudAuthorization(config, payload, timestamp),
  };
  if (config.tencent.securityToken) headers["X-TC-Token"] = config.tencent.securityToken;
  const response = await fetchImpl("https://captcha.tencentcloudapi.com/", {
    method: "POST",
    headers,
    body: payload,
    signal: AbortSignal.timeout(config.captchaTimeoutMs),
  });
  const result = await responseJson(response);
  const ticketResult = result.Response;
  if (!ticketResult || ticketResult.Error) throw captchaUnavailable();
  if (ticketResult.CaptchaCode !== 1 || Number(ticketResult.EvilLevel || 0) === 100) throw captchaFailure();
}

async function verifyTencentLegacy(config, input, remoteIp, fetchImpl) {
  // Compatibility for accounts that only have a Captcha AppSecretKey. Prefer TC3
  // with least-privilege CAM credentials for new production deployments.
  const response = await fetchImpl("https://ssl.captcha.qq.com/ticket/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      aid: config.tencent.appId,
      AppSecretKey: config.tencent.appSecretKey,
      Ticket: input.token,
      Randstr: input.randstr,
      UserIP: remoteIp,
    }),
    signal: AbortSignal.timeout(config.captchaTimeoutMs),
  });
  const result = await responseJson(response);
  if (String(result.response) !== "1" || Number(result.evil_level || 0) === 100) throw captchaFailure();
}

async function verifyTencent(config, input, remoteIp, fetchImpl) {
  if (typeof input.token !== "string" || input.token.length < 1 || input.token.length > 4096 || input.token.startsWith("trerror_")) {
    throw captchaFailure();
  }
  if (typeof input.randstr !== "string" || input.randstr.length < 1 || input.randstr.length > 256) throw captchaFailure();
  if (!remoteIp || remoteIp === "unknown") throw captchaUnavailable();
  try {
    if (config.tencent.verifyMode === "tc3") {
      await verifyTencentCurrent(config, input, remoteIp, fetchImpl);
    } else {
      await verifyTencentLegacy(config, input, remoteIp, fetchImpl);
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw captchaUnavailable();
  }
}

export function createCaptchaVerifier(config, fetchImpl = fetch) {
  let active = 0;
  return async function verifyCaptcha(input, remoteIp, action) {
    if (!input || typeof input !== "object" || !["turnstile", "tencent"].includes(input.provider)) {
      throw captchaFailure("Choose a security verification provider and complete verification.");
    }
    if ((input.provider === "turnstile" && !config.turnstile.enabled) || (input.provider === "tencent" && !config.tencent.enabled)) {
      throw captchaFailure();
    }
    if (active >= config.captchaConcurrency) {
      throw new HttpError(429, "VERIFICATION_BUSY", "Too many verifications are in progress. Please try again shortly.");
    }
    active += 1;
    try {
      if (input.provider === "turnstile") {
        await verifyTurnstile(config, input, remoteIp, action, fetchImpl);
      } else {
        await verifyTencent(config, input, remoteIp, fetchImpl);
      }
    } finally {
      active -= 1;
    }
  };
}
