import { createHash, createHmac, randomUUID } from "node:crypto";
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

function aliyunAuthorization(config, body) {
  const algorithm = "ACS3-HMAC-SHA256";
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    host: config.aliyun.endpoint,
    "x-acs-action": "VerifyIntelligentCaptcha",
    "x-acs-version": "2023-03-05",
    "x-acs-date": new Date().toISOString().replace(/\.\d{3}Z$/u, "Z"),
    "x-acs-signature-nonce": randomUUID(),
    "x-acs-content-sha256": sha256(body),
  };
  if (config.aliyun.securityToken) headers["x-acs-security-token"] = config.aliyun.securityToken;

  const sorted = Object.entries(headers).sort(([left], [right]) => left.localeCompare(right));
  const canonicalHeaders = sorted.map(([key, value]) => `${key}:${String(value).trim()}\n`).join("");
  const signedHeaders = sorted.map(([key]) => key).join(";");
  const canonicalRequest = [
    "POST",
    "/",
    "",
    canonicalHeaders,
    signedHeaders,
    headers["x-acs-content-sha256"],
  ].join("\n");
  const stringToSign = `${algorithm}\n${sha256(canonicalRequest)}`;
  const signature = hmac(config.aliyun.accessKeySecret, stringToSign, "hex");
  return {
    ...headers,
    Authorization: `${algorithm} Credential=${config.aliyun.accessKeyId},SignedHeaders=${signedHeaders},Signature=${signature}`,
  };
}

async function verifyAliyun(config, input, fetchImpl) {
  if (typeof input.token !== "string" || input.token.length < 1 || input.token.length > 8192) {
    throw captchaFailure();
  }
  const body = new URLSearchParams({
    CaptchaVerifyParam: input.token,
    SceneId: config.aliyun.sceneId,
  }).toString();
  try {
    const response = await fetchImpl(`https://${config.aliyun.endpoint}/`, {
      method: "POST",
      headers: aliyunAuthorization(config, body),
      body,
      signal: AbortSignal.timeout(config.captchaTimeoutMs),
    });
    const result = await responseJson(response);
    if (result.Success !== true || result.Result?.VerifyResult !== true) throw captchaFailure();
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw captchaUnavailable();
  }
}

export function createCaptchaVerifier(config, fetchImpl = fetch) {
  let active = 0;
  return async function verifyCaptcha(input, remoteIp, action) {
    if (!input || typeof input !== "object" || !["turnstile", "aliyun"].includes(input.provider)) {
      throw captchaFailure("Choose a security verification provider and complete verification.");
    }
    if ((input.provider === "turnstile" && !config.turnstile.enabled) || (input.provider === "aliyun" && !config.aliyun.enabled)) {
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
        await verifyAliyun(config, input, fetchImpl);
      }
    } finally {
      active -= 1;
    }
  };
}
