import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { loadConfig, loadEnvFile } from "../src/config.js";
import { RegistrationStore } from "../src/database.js";
import { createRegistrationService } from "../src/app.js";
import { createCaptchaVerifier } from "../src/captcha.js";
import { HttpError } from "../src/validation.js";
import { clientIp } from "../src/security.js";

const ADMIN_TOKEN = "test-admin-token-that-is-long-and-random-1234567890";
const TEST_PDF = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n");
const staticDirectory = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../conference/aidp2026");

function configuration(overrides = {}) {
  return loadConfig({
    NODE_ENV: "test",
    TURNSTILE_ENABLED: "true",
    TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    TURNSTILE_EXPECTED_HOSTNAMES: "localhost",
    TENCENT_CAPTCHA_ENABLED: "false",
    ADMIN_API_TOKEN: ADMIN_TOKEN,
    DEBUG_ADMIN_ENABLED: "true",
    ...overrides,
  });
}

async function fixture(t, { env = {}, verify, static: serveStatic = false } = {}) {
  const dataDirectory = mkdtempSync(join(tmpdir(), "aidp2026-test-"));
  const calls = [];
  const verifyCaptcha = verify || (async (input, ip, action) => {
    calls.push({ input, ip, action });
    if (!input?.token) throw new HttpError(400, "CAPTCHA_FAILED", "Captcha required.");
  });
  const config = configuration({ SERVE_STATIC: String(serveStatic), ...env });
  const { server, store, files } = createRegistrationService({
    config,
    dataDirectory,
    staticDirectory: serveStatic ? staticDirectory : undefined,
    verifyCaptcha,
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolveClose) => server.close(resolveClose));
    rmSync(dataDirectory, { recursive: true, force: true });
  });
  return { base, calls, config, store, files };
}

function conference(overrides = {}) {
  return {
    fullName: "Ada Lovelace",
    email: "ada@example.org",
    affiliation: "Analytical Engines Lab",
    role: "researcher",
    dates: ["2026-11-28"],
    consent: true,
    formStartedAt: Date.now() - 5000,
    website: "",
    captcha: { provider: "turnstile", token: "test-token" },
    ...overrides,
  };
}

function poster(overrides = {}) {
  return {
    fullName: "Grace Hopper",
    email: "grace@example.org",
    affiliation: "Compilers Institute",
    title: "Robust validation for digital pathology models",
    authors: "Grace Hopper, Ada Lovelace",
    topic: "clinical-translation",
    posterFile: { name: "robust-poster.pdf", size: TEST_PDF.length },
    consent: true,
    formStartedAt: Date.now() - 5000,
    website: "",
    captcha: { provider: "turnstile", token: "test-token" },
    ...overrides,
  };
}

async function submit(base, type, body, { key = randomUUID(), headers = {} } = {}) {
  return fetch(`${base}/api/aidp2026/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function uploadPdf(base, initialization, { token = initialization.upload.token, body = TEST_PDF, headers = {} } = {}) {
  return fetch(`${base}${initialization.upload.url}`, {
    method: "POST",
    headers: { "Content-Type": "application/pdf", "X-Upload-Token": token, ...headers },
    body,
  });
}

async function submitPoster(base, overrides = {}, options = {}) {
  const response = await submit(base, "posters", poster(overrides), options);
  assert.equal(response.status, 202);
  const initialization = await response.json();
  const upload = await uploadPdf(base, initialization);
  assert.equal(upload.status, 201);
  return { initialization, result: await upload.json() };
}

test("public config exposes only public CAPTCHA identifiers", async (t) => {
  const { base } = await fixture(t);
  const response = await fetch(`${base}/api/aidp2026/config`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.registration.open, true);
  assert.equal(body.posters.open, true);
  assert.equal(body.posters.maxPdfBytes, 5 * 1024 * 1024);
  assert.equal(body.retentionDays, 180);
  assert.equal(body.captcha.turnstile.siteKey, "1x00000000000000000000AA");
  assert.ok(!JSON.stringify(body).includes("1x0000000000000000000000000000000AA"));
  assert.ok(!JSON.stringify(body).includes(ADMIN_TOKEN));
});

test("conference registration accepts and flags duplicates for reconciliation", async (t) => {
  const { base, calls } = await fixture(t);
  const response = await submit(base, "registrations", conference());
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.match(body.reference, /^AIDP26-C-[0-9A-F]{12}$/u);
  assert.equal(calls[0].action, "aidp2026-conference");

  const duplicate = await submit(base, "registrations", conference({ fullName: "Another Person" }));
  assert.equal(duplicate.status, 201);
  assert.equal((await duplicate.json()).error, undefined);

  const admin = await fetch(`${base}/api/aidp2026/admin/submissions?kind=conference`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  const records = await admin.json();
  assert.equal(records.total, 2);
  assert.ok(records.items.every((item) => item.duplicateCount === 2));
  const original = records.items.find((item) => item.fullName === "Ada Lovelace");
  assert.equal(original.email, "ada@example.org");
  assert.deepEqual(original.dates, ["2026-11-28"]);
  assert.ok(!("captcha" in original));
});

test("idempotent replay does not consume another CAPTCHA token", async (t) => {
  const { base, calls } = await fixture(t);
  const key = randomUUID();
  const first = await submit(base, "registrations", conference(), { key });
  assert.equal(first.status, 201);
  const replay = await submit(base, "registrations", conference(), { key });
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).replay, true);
  assert.equal(calls.length, 1);

  const conflict = await submit(base, "registrations", conference({ fullName: "Changed Name" }), { key });
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).error.code, "IDEMPOTENCY_CONFLICT");
});

test("poster PDF upload stores metadata and supports private admin download", async (t) => {
  const { base } = await fixture(t);
  await submit(base, "registrations", conference({ email: "grace@example.org", fullName: "Grace Hopper" }));
  const first = await submitPoster(base);
  assert.match(first.result.reference, /^AIDP26-P-/u);

  const duplicate = await submitPoster(base, { title: "  Robust   validation for digital pathology models " });
  assert.match(duplicate.result.reference, /^AIDP26-P-/u);

  const admin = await fetch(`${base}/api/aidp2026/admin/submissions?kind=poster`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  const records = await admin.json();
  assert.equal(records.total, 2);
  assert.ok(records.items.every((item) => item.duplicateCount === 2 && item.uploadStatus === "complete"));
  assert.equal(records.items[0].topic, "clinical-translation");
  assert.equal(records.items[0].pdfFileName, "robust-poster.pdf");
  assert.equal(records.items[0].pdfSize, TEST_PDF.length);

  const unauthorized = await fetch(`${base}/api/aidp2026/admin/submissions/${first.result.reference}/pdf`);
  assert.equal(unauthorized.status, 401);
  const download = await fetch(`${base}/api/aidp2026/admin/submissions/${first.result.reference}/pdf`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("content-type"), "application/pdf");
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), TEST_PDF);
});

test("administrators can delete records and their poster files", async (t) => {
  const { base, files } = await fixture(t);
  await submit(base, "registrations", conference());
  const poster = await submitPoster(base);

  const unauthorized = await fetch(`${base}/api/aidp2026/admin/submissions/${poster.result.reference}`, { method: "DELETE" });
  assert.equal(unauthorized.status, 401);

  const deletedPoster = await fetch(`${base}/api/aidp2026/admin/submissions/${poster.result.reference}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(deletedPoster.status, 200);
  assert.throws(() => files.get(poster.result.reference));

  const records = await fetch(`${base}/api/aidp2026/admin/submissions`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  }).then((response) => response.json());
  assert.equal(records.total, 1);
  assert.equal(records.items[0].kind, "conference");

  const conferenceId = records.items[0].id;
  const deletedConference = await fetch(`${base}/api/aidp2026/admin/submissions/${conferenceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(deletedConference.status, 200);
  const missing = await fetch(`${base}/api/aidp2026/admin/submissions/${conferenceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(missing.status, 404);
});

test("poster upload rejects bad tokens and invalid PDFs without consuming the session", async (t) => {
  const { base } = await fixture(t);
  const response = await submit(base, "posters", poster());
  assert.equal(response.status, 202);
  const initialization = await response.json();

  const badToken = await uploadPdf(base, initialization, { token: "invalid-token-that-is-long-enough-for-checking" });
  assert.equal(badToken.status, 401);

  const invalidPdf = Buffer.from(TEST_PDF);
  invalidPdf.write("NOT_P", 0, "ascii");
  const invalid = await uploadPdf(base, initialization, { body: invalidPdf });
  assert.equal(invalid.status, 415);
  assert.equal((await invalid.json()).error.code, "INVALID_PDF");

  const valid = await uploadPdf(base, initialization);
  assert.equal(valid.status, 201);
  const replay = await uploadPdf(base, initialization);
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).replay, true);
});

test("poster metadata idempotency renews pending upload tokens and completes replay", async (t) => {
  const { base } = await fixture(t);
  const key = randomUUID();
  const firstResponse = await submit(base, "posters", poster(), { key });
  assert.equal(firstResponse.status, 202);
  const first = await firstResponse.json();

  const renewedResponse = await submit(base, "posters", poster(), { key });
  assert.equal(renewedResponse.status, 200);
  const renewed = await renewedResponse.json();
  assert.equal(renewed.reference, first.reference);
  assert.equal(renewed.uploadRequired, true);
  assert.notEqual(renewed.upload.token, first.upload.token);

  const uploaded = await uploadPdf(base, renewed);
  assert.equal(uploaded.status, 201);
  const completedResponse = await submit(base, "posters", poster(), { key });
  assert.equal(completedResponse.status, 200);
  const completed = await completedResponse.json();
  assert.equal(completed.uploadRequired, false);
  assert.equal(completed.reference, first.reference);
});

test("poster file validation rejects non-PDF and oversized files", async (t) => {
  const { base } = await fixture(t, { env: { PDF_MAX_BYTES: "1024" } });
  const wrongType = await submit(base, "posters", poster({ posterFile: { name: "poster.txt", size: TEST_PDF.length } }));
  assert.equal(wrongType.status, 400);
  const tooMuchMetadata = await submit(base, "posters", poster({ posterFile: { name: "poster.pdf", size: 1025 } }));
  assert.equal(tooMuchMetadata.status, 400);

  const response = await submit(base, "posters", poster());
  assert.equal(response.status, 202);
  const initialization = await response.json();
  const oversized = await uploadPdf(base, initialization, { body: Buffer.alloc(1025) });
  assert.equal(oversized.status, 413);
});

test("validation, consent, honeypot, and JSON limits are enforced", async (t) => {
  const { base } = await fixture(t);
  const invalid = await submit(base, "registrations", conference({ role: "administrator" }));
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, "VALIDATION_ERROR");

  const noConsent = await submit(base, "registrations", conference({ consent: false }));
  assert.equal(noConsent.status, 400);

  const honeypot = await submit(base, "registrations", conference({ website: "spam.example" }));
  assert.equal(honeypot.status, 400);

  const wrongType = await fetch(`${base}/api/aidp2026/registrations`, {
    method: "POST",
    headers: { "Content-Type": "text/plain", "Idempotency-Key": randomUUID() },
    body: "not json",
  });
  assert.equal(wrongType.status, 415);

  const tooLarge = await fetch(`${base}/api/aidp2026/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": randomUUID() },
    body: JSON.stringify({ value: "x".repeat(40000) }),
  });
  assert.equal(tooLarge.status, 413);
});

test("POST rate limit returns Retry-After", async (t) => {
  const { base } = await fixture(t, { env: { RATE_LIMIT_SUBMIT_PER_WINDOW: "2" } });
  await submit(base, "registrations", conference());
  await submit(base, "registrations", conference({ email: "second@example.org" }));
  const limited = await submit(base, "registrations", conference({ email: "third@example.org" }));
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error.code, "RATE_LIMITED");
  assert.ok(Number(limited.headers.get("retry-after")) >= 1);
});

test("admin routes require authentication and CSV escapes formulas", async (t) => {
  const { base } = await fixture(t);
  const unauthorized = await fetch(`${base}/api/aidp2026/admin/submissions`);
  assert.equal(unauthorized.status, 401);

  await submit(base, "registrations", conference({ fullName: "=2+2" }));
  await submit(base, "registrations", conference({ fullName: "＝2+2" }));
  const csv = await fetch(`${base}/api/aidp2026/admin/export.csv`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type"), /text\/csv/u);
  const contents = await csv.text();
  assert.ok(contents.includes("\"'=2+2\""));
  assert.ok(contents.includes("\"'＝2+2\""));
  assert.ok(!contents.includes("\"=2+2\""));
});

test("local admin debug bypass is explicit and never enabled in production", async (t) => {
  const local = await fixture(t, { env: { DEBUG_ALLOW_CAPTCHA_BYPASS: "true" } });
  const response = await submit(local.base, "registrations", conference({ captcha: undefined }), {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "X-Admin-Debug": "bypass-captcha" },
  });
  assert.equal(response.status, 201);
  assert.equal(local.calls.length, 0);

  const debug = await fetch(`${local.base}/api/aidp2026/admin/debug`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  const debugBody = await debug.json();
  assert.equal(debugBody.debugCaptchaBypassAvailable, true);
  assert.ok(!JSON.stringify(debugBody).includes(ADMIN_TOKEN));

  const production = await fixture(t, {
    env: {
      NODE_ENV: "production",
      DEBUG_ALLOW_CAPTCHA_BYPASS: "true",
      TURNSTILE_SITE_KEY: "0x4AAAAAA-production-site-key",
      TURNSTILE_SECRET_KEY: "0x4AAAAAA-production-secret-key",
      TURNSTILE_EXPECTED_HOSTNAMES: "hkustsmartlab.github.io",
    },
  });
  const productionResponse = await submit(production.base, "registrations", conference({ email: "prod@example.org", captcha: undefined }), {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "X-Admin-Debug": "bypass-captcha" },
  });
  assert.equal(productionResponse.status, 400);
  assert.equal(production.calls.length, 1);
});

test("CORS allowlist and preflight headers are enforced", async (t) => {
  const { base } = await fixture(t);
  const rejected = await fetch(`${base}/api/aidp2026/config`, { headers: { Origin: "https://attacker.example" } });
  assert.equal(rejected.status, 403);

  const origin = "https://hkustsmartlab.github.io";
  const preflight = await fetch(`${base}/api/aidp2026/registrations`, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,idempotency-key",
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
  assert.match(preflight.headers.get("access-control-allow-headers"), /Idempotency-Key/u);

  const adminCors = await fetch(`${base}/api/aidp2026/admin/submissions`, {
    headers: { Origin: origin, Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  assert.equal(adminCors.status, 403);
  assert.equal(adminCors.headers.get("access-control-allow-origin"), null);
});

test("closed poster deadline fails before reading a submission", async (t) => {
  const { base, calls } = await fixture(t, { env: { POSTER_DEADLINE: "2020-01-01T00:00:00Z" } });
  const response = await submit(base, "posters", poster());
  assert.equal(response.status, 410);
  assert.equal(calls.length, 0);
});

test("local static serving links the conference homepage", async (t) => {
  const { base } = await fixture(t, { static: true });
  const response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /AIDP 2026/u);
  const missing = await fetch(`${base}/services/aidp2026-registration/.env`);
  assert.equal(missing.status, 404);
  const latex = await fetch(`${base}/docs/AIDP2026_Poster_Template.tex`, { method: "HEAD" });
  assert.equal(latex.status, 200);
  assert.match(latex.headers.get("content-type"), /application\/x-tex/u);
  const word = await fetch(`${base}/docs/AIDP2026_Poster_Template.docx`, { method: "HEAD" });
  assert.equal(word.status, 200);
  assert.match(word.headers.get("content-type"), /wordprocessingml/u);
  const privacy = await fetch(`${base}/privacy.html`);
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /Privacy Notice and Consent/u);
});

test("Cloudflare Siteverify checks action and hostname", async () => {
  const requests = [];
  const fetchMock = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ success: true, action: "aidp2026-conference", hostname: "localhost" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const verify = createCaptchaVerifier(configuration(), fetchMock);
  await verify({ provider: "turnstile", token: "dummy" }, "127.0.0.1", "aidp2026-conference");
  assert.equal(requests[0].url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.match(requests[0].options.body.toString(), /response=dummy/u);

  await assert.rejects(
    verify({ provider: "turnstile", token: "dummy" }, "127.0.0.1", "aidp2026-poster"),
    (error) => error.code === "CAPTCHA_FAILED",
  );
});

test("Tencent TC3 request matches a fixed signature vector and rejects malicious risk", async (t) => {
  const originalNow = Date.now;
  Date.now = () => 1700000000000;
  t.after(() => { Date.now = originalNow; });
  const requests = [];
  let evilLevel = 0;
  const fetchMock = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ Response: { CaptchaCode: 1, EvilLevel: evilLevel } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const config = configuration({
    TENCENT_CAPTCHA_ENABLED: "true",
    TENCENT_CAPTCHA_APP_ID: "189949311",
    TENCENT_CAPTCHA_SECRET_KEY: "app-secret",
    TENCENT_CAPTCHA_VERIFY_MODE: "tc3",
    TENCENT_SECRET_ID: "AKIDTEST",
    TENCENT_SECRET_KEY: "cam-secret",
  });
  const verify = createCaptchaVerifier(config, fetchMock);
  const input = { provider: "tencent", token: "ticket", randstr: "@test" };
  await verify(input, "127.0.0.1", "aidp2026-poster");
  assert.equal(
    requests[0].options.headers.Authorization,
    "TC3-HMAC-SHA256 Credential=AKIDTEST/2023-11-14/captcha/tc3_request, SignedHeaders=content-type;host, Signature=5e0c99b342c7fee5bb32338be11bfbcd2f406c088374c69f54a2de463c4b1f2f",
  );
  assert.equal(requests[0].options.headers["X-TC-Action"], "DescribeCaptchaResult");
  assert.equal(JSON.parse(requests[0].options.body).CaptchaType, 9);

  evilLevel = 100;
  await assert.rejects(verify(input, "127.0.0.1", "aidp2026-poster"), (error) => error.code === "CAPTCHA_FAILED");
});

test("Tencent compatibility mode uses app key without exposing it to the browser", async () => {
  let captured;
  const fetchMock = async (url, options) => {
    captured = { url, options };
    return new Response(JSON.stringify({ response: "1", evil_level: "0" }), { status: 200 });
  };
  const config = configuration({
    TENCENT_CAPTCHA_ENABLED: "true",
    TENCENT_CAPTCHA_APP_ID: "189949311",
    TENCENT_CAPTCHA_SECRET_KEY: "app-secret",
    TENCENT_CAPTCHA_VERIFY_MODE: "legacy",
  });
  const verify = createCaptchaVerifier(config, fetchMock);
  await verify({ provider: "tencent", token: "ticket", randstr: "@test" }, "127.0.0.1", "aidp2026-poster");
  assert.equal(captured.url, "https://ssl.captcha.qq.com/ticket/verify");
  assert.match(captured.options.body.toString(), /AppSecretKey=app-secret/u);
  await assert.rejects(
    verify({ provider: "tencent", token: "trerror_1001_189949311_1", randstr: "@test" }, "127.0.0.1", "aidp2026-poster"),
    (error) => error.code === "CAPTCHA_FAILED",
  );
});

test("production rejects public example credentials and ambiguous environments", () => {
  assert.throws(() => configuration({ NODE_ENV: "production" }), /refuses Cloudflare Turnstile test keys/u);
  assert.throws(() => configuration({ NODE_ENV: "Production" }), /NODE_ENV must be/u);
  assert.throws(() => configuration({ TENCENT_CAPTCHA_ENABLED: "true", TENCENT_CAPTCHA_APP_ID: "1", TENCENT_CAPTCHA_SECRET_KEY: "x", TENCENT_SECRET_ID: "only-one" }), /configured together/u);
  assert.throws(() => configuration({
    NODE_ENV: "production",
    TURNSTILE_SITE_KEY: "0x4AAAAAA-production-site-key",
    TURNSTILE_SECRET_KEY: "0x4AAAAAA-production-secret-key",
    TURNSTILE_EXPECTED_HOSTNAMES: "hkustsmartlab.github.io",
    TENCENT_CAPTCHA_ENABLED: "true",
    TENCENT_CAPTCHA_APP_ID: "1",
    TENCENT_CAPTCHA_SECRET_KEY: "x",
  }), /explicit TENCENT_CAPTCHA_VERIFY_MODE/u);
});

test("production Turnstile validation requires an exact action", async () => {
  const config = configuration({
    NODE_ENV: "production",
    TURNSTILE_SITE_KEY: "0x4AAAAAA-production-site-key",
    TURNSTILE_SECRET_KEY: "0x4AAAAAA-production-secret-key",
    TURNSTILE_EXPECTED_HOSTNAMES: "hkustsmartlab.github.io",
  });
  const fetchMock = async () => new Response(JSON.stringify({ success: true, hostname: "hkustsmartlab.github.io" }), { status: 200 });
  const verify = createCaptchaVerifier(config, fetchMock);
  await assert.rejects(
    verify({ provider: "turnstile", token: "real-token" }, "127.0.0.1", "aidp2026-conference"),
    (error) => error.code === "CAPTCHA_FAILED",
  );
});

test("forwarded client IPs are accepted only from an exact trusted proxy peer", () => {
  const request = (peer, forwarded) => ({
    socket: { remoteAddress: peer },
    headers: { "x-forwarded-for": forwarded },
  });
  assert.equal(clientIp(request("127.0.0.1", "203.0.113.10"), 1, ["127.0.0.1"]), "203.0.113.10");
  assert.equal(clientIp(request("192.0.2.20", "203.0.113.10"), 1, ["127.0.0.1"]), "192.0.2.20");
  assert.equal(clientIp(request("127.0.0.1", "203.0.113.10, 198.51.100.20"), 1, ["127.0.0.1"]), "198.51.100.20");
  assert.equal(clientIp(request("127.0.0.1", "203.0.113.10, 198.51.100.20"), 2, ["127.0.0.1"]), "203.0.113.10");
});

test("retention cleanup deletes old submissions and their idempotency records", async (t) => {
  const { base, store } = await fixture(t);
  await submit(base, "registrations", conference());
  const old = new Date(Date.now() - 181 * 86400000).toISOString();
  store.db.prepare("UPDATE submissions SET created_at = ?").run(old);
  store.db.prepare("UPDATE idempotency_keys SET created_at = ?").run(old);
  assert.equal(store.purgeOlderThan(180), 1);
  assert.deepEqual(store.counts(), { conference: 0, poster: 0 });
  assert.equal(store.db.prepare("SELECT COUNT(*) AS count FROM idempotency_keys").get().count, 0);
});

test("malformed env errors never echo a secret-bearing line", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "aidp2026-env-"));
  const path = join(directory, ".env");
  writeFileSync(path, "SECRET_VALUE_WITHOUT_EQUALS_SIGN\n");
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.throws(
    () => loadEnvFile(path),
    (error) => error.message.includes("line 1") && !error.message.includes("SECRET_VALUE_WITHOUT_EQUALS_SIGN"),
  );
});

test("JSON media type parsing rejects lookalike content types", async (t) => {
  const { base } = await fixture(t);
  const response = await fetch(`${base}/api/aidp2026/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/jsonfoo", "Idempotency-Key": randomUUID() },
    body: "{}",
  });
  assert.equal(response.status, 415);
});

test("debug CAPTCHA bypass is disabled whenever a proxy is configured", async (t) => {
  const { base, calls } = await fixture(t, { env: { DEBUG_ALLOW_CAPTCHA_BYPASS: "true", TRUST_PROXY: "1" } });
  const response = await submit(base, "registrations", conference({ captcha: undefined }), {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, "X-Admin-Debug": "bypass-captcha" },
  });
  assert.equal(response.status, 400);
  assert.equal(calls.length, 1);
});

test("version 1 database migration preserves records and removes hard uniqueness", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "aidp2026-migration-"));
  const path = join(directory, "registrations.sqlite");
  const legacy = new DatabaseSync(path);
  legacy.exec(`
    CREATE TABLE submissions (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL CHECK (kind IN ('conference', 'poster')),
      created_at TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      affiliation TEXT NOT NULL,
      details_json TEXT NOT NULL,
      dedupe_key TEXT NOT NULL,
      UNIQUE (kind, dedupe_key)
    ) STRICT;
    CREATE TABLE idempotency_keys (
      kind TEXT NOT NULL,
      key TEXT NOT NULL,
      request_hash TEXT NOT NULL,
      submission_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (kind, key),
      FOREIGN KEY (submission_id) REFERENCES submissions(id)
    ) STRICT;
  `);
  const createdAt = new Date().toISOString();
  legacy.prepare("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    "AIDP26-C-LEGACY01", "conference", createdAt, "Legacy User", "ada@example.org", "Legacy Lab", '{"role":"researcher","dates":["2026-11-28"]}', "ada@example.org",
  );
  legacy.prepare("INSERT INTO idempotency_keys VALUES (?, ?, ?, ?, ?)").run("conference", "old-key", "old-hash", "AIDP26-C-LEGACY01", createdAt);
  legacy.close();

  let store;
  t.after(() => {
    if (store) store.close();
    rmSync(directory, { recursive: true, force: true });
  });
  store = new RegistrationStore(directory);
  assert.equal(store.db.prepare("PRAGMA user_version").get().user_version, 2);
  assert.deepEqual(store.findIdempotency("conference", "old-key", "old-hash"), { reference: "AIDP26-C-LEGACY01", replay: true });

  const duplicate = store.create("conference", {
    fullName: "Legitimate Attendee",
    email: "ada@example.org",
    affiliation: "Current Lab",
    role: "academic",
    dates: ["2026-11-29"],
  }, "ada@example.org", "new-key", "new-hash");
  assert.match(duplicate.reference, /^AIDP26-C-/u);
  assert.equal(store.counts().conference, 2);
  assert.equal(store.list({ kind: "conference" }).items[0].duplicateCount, 2);
  assert.equal(store.db.prepare("PRAGMA foreign_key_check").all().length, 0);
});

test("Cloudflare edge country selects Tencent only for mainland China", async (t) => {
  const { base } = await fixture(t, {
    env: {
      TRUST_PROXY: "1",
      GEO_PROVIDER: "cloudflare",
      TENCENT_CAPTCHA_ENABLED: "true",
      TENCENT_CAPTCHA_APP_ID: "189949311",
      TENCENT_CAPTCHA_SECRET_KEY: "app-secret",
    },
  });
  async function preferred(country) {
    const response = await fetch(`${base}/api/aidp2026/config`, { headers: { "CF-IPCountry": country } });
    assert.equal(response.status, 200);
    return (await response.json()).captcha.preferredProvider;
  }
  assert.equal(await preferred("CN"), "tencent");
  assert.equal(await preferred("cn"), "tencent");
  assert.equal(await preferred("HK"), "turnstile");
  assert.equal(await preferred("MO"), "turnstile");
  assert.equal(await preferred("TW"), "turnstile");
  assert.equal(await preferred("US"), "turnstile");
  assert.equal(await preferred("XX"), "auto");
  assert.equal(await preferred("T1"), "auto");
  assert.equal(await preferred("CN,US"), "auto");
});

test("EdgeOne country header is supported and direct geo headers are untrusted", async (t) => {
  const edge = await fixture(t, {
    env: {
      TRUST_PROXY: "1",
      GEO_PROVIDER: "edgeone",
      TENCENT_CAPTCHA_ENABLED: "true",
      TENCENT_CAPTCHA_APP_ID: "189949311",
      TENCENT_CAPTCHA_SECRET_KEY: "app-secret",
    },
  });
  const cn = await fetch(`${edge.base}/api/aidp2026/config`, { headers: { "EO-Client-IPCountry": "CN" } });
  assert.equal((await cn.json()).captcha.preferredProvider, "tencent");
  const outside = await fetch(`${edge.base}/api/aidp2026/config`, { headers: { "EO-Client-IPCountry": "GB" } });
  assert.equal((await outside.json()).captcha.preferredProvider, "turnstile");

  const direct = await fixture(t, {
    env: {
      GEO_PROVIDER: "cloudflare",
      TENCENT_CAPTCHA_ENABLED: "true",
      TENCENT_CAPTCHA_APP_ID: "189949311",
      TENCENT_CAPTCHA_SECRET_KEY: "app-secret",
    },
  });
  const spoofed = await fetch(`${direct.base}/api/aidp2026/config`, { headers: { "CF-IPCountry": "CN" } });
  assert.equal((await spoofed.json()).captcha.preferredProvider, "auto");
});
