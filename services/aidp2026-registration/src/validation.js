import { createHash } from "node:crypto";

export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const ROLES = new Set(["student", "academic", "researcher", "clinical", "industry", "other"]);
const DATES = ["2026-11-27", "2026-11-28", "2026-11-29"];
const TOPICS = new Set([
  "foundation-models",
  "multimodal-learning",
  "multi-omics",
  "ai-agents",
  "clinical-translation",
  "other",
]);

function text(value, field, { min = 1, max = 200, multiline = false } = {}) {
  if (typeof value !== "string") {
    throw new HttpError(400, "VALIDATION_ERROR", `${field} is required.`, { [field]: "Required" });
  }
  const normalized = value.normalize("NFC").replace(/\r\n?/gu, "\n").trim();
  const disallowedControls = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u : /[\u0000-\u001F\u007F]/u;
  if (disallowedControls.test(normalized) || normalized.length < min || normalized.length > max) {
    throw new HttpError(400, "VALIDATION_ERROR", `${field} is invalid.`, {
      [field]: `Use ${min}–${max} characters${multiline ? "" : " on one line"}.`,
    });
  }
  return normalized;
}

function email(value) {
  const normalized = text(value, "email", { min: 3, max: 254 }).toLowerCase();
  const parts = normalized.split("@");
  if (parts.length !== 2 || parts[0].length > 64 || !/^[^\s@]+$/u.test(parts[0]) || !/^[^\s@.]+(?:\.[^\s@.]+)+$/u.test(parts[1])) {
    throw new HttpError(400, "VALIDATION_ERROR", "Email is invalid.", { email: "Enter a valid email address." });
  }
  return normalized;
}

function choice(value, field, choices) {
  const normalized = text(value, field, { max: 50 });
  if (!choices.has(normalized)) {
    throw new HttpError(400, "VALIDATION_ERROR", `${field} is invalid.`, { [field]: "Choose a listed option." });
  }
  return normalized;
}

function commonFields(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "INVALID_JSON", "A JSON object is required.");
  }
  if (body.consent !== true) {
    throw new HttpError(400, "VALIDATION_ERROR", "Consent is required.", { consent: "Please confirm before submitting." });
  }

  const startedAt = Number(body.formStartedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 1000 || elapsed > 6 * 60 * 60 * 1000) {
    throw new HttpError(400, "FORM_TIMING_INVALID", "The form session is invalid or has expired. Refresh the page and try again.");
  }
  if (typeof body.website === "string" && body.website.length > 0) {
    throw new HttpError(400, "SUBMISSION_REJECTED", "The submission could not be processed.");
  }

  return {
    fullName: text(body.fullName, "fullName", { max: 120 }),
    email: email(body.email),
    affiliation: text(body.affiliation, "affiliation", { min: 2, max: 200 }),
  };
}

function posterFile(value, maxBytes) {
  const suppliedName = text(value?.name, "fileName", { min: 5, max: 180 });
  const originalName = suppliedName.split(/[\\/]/u).pop();
  const size = value?.size;
  if (!/\.pdf$/iu.test(originalName) || !Number.isSafeInteger(size) || size < 1 || size > maxBytes) {
    throw new HttpError(400, "VALIDATION_ERROR", "Select one PDF file no larger than 5 MB.", {
      fileName: "One PDF, up to 5 MB, is required.",
    });
  }
  return { originalName, size };
}

export function validateSubmission(kind, body, { pdfMaxBytes = 5 * 1024 * 1024 } = {}) {
  const common = commonFields(body);
  let details;
  let dedupeKey;

  if (kind === "conference") {
    if (!Array.isArray(body.dates) || body.dates.length < 1 || body.dates.length > DATES.length) {
      throw new HttpError(400, "VALIDATION_ERROR", "Select at least one attendance date.", { dates: "Select at least one date." });
    }
    const selectedDates = new Set(body.dates);
    if (selectedDates.size !== body.dates.length || body.dates.some((date) => !DATES.includes(date))) {
      throw new HttpError(400, "VALIDATION_ERROR", "Attendance dates are invalid.", { dates: "Choose valid conference dates." });
    }
    details = {
      role: choice(body.role, "role", ROLES),
      dates: DATES.filter((date) => selectedDates.has(date)),
    };
    dedupeKey = common.email;
  } else if (kind === "poster") {
    const title = text(body.title, "title", { min: 5, max: 300 });
    details = {
      title,
      authors: text(body.authors, "authors", { min: 2, max: 1000, multiline: true }),
      topic: choice(body.topic, "topic", TOPICS),
      expectedFile: posterFile(body.posterFile, pdfMaxBytes),
    };
    dedupeKey = createHash("sha256").update(`${common.email}\n${title.toLowerCase().replace(/\s+/gu, " ")}`).digest("hex");
  } else {
    throw new HttpError(404, "NOT_FOUND", "Not found.");
  }

  return {
    data: { ...common, ...details },
    dedupeKey,
    requestHash: createHash("sha256").update(JSON.stringify({ kind, ...common, ...details })).digest("hex"),
  };
}
