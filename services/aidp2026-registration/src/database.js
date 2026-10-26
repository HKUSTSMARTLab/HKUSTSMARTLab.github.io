import { mkdirSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const DETAIL_FIELDS = {
  conference: ["role", "dates"],
  poster: ["title", "authors", "topic", "expectedFile"],
};
const SCHEMA_VERSION = 2;
const SUBMISSIONS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('conference', 'poster')),
    created_at TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    affiliation TEXT NOT NULL,
    details_json TEXT NOT NULL,
    dedupe_key TEXT NOT NULL
  ) STRICT;
`;
const IDEMPOTENCY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS idempotency_keys (
    kind TEXT NOT NULL,
    key TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    submission_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (kind, key),
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
  ) STRICT;
`;
const UPLOAD_SESSION_SCHEMA = `
  CREATE TABLE IF NOT EXISTS upload_sessions (
    submission_id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    completed_at TEXT,
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
  ) STRICT;
`;

function migrateSchema(db) {
  const version = db.prepare("PRAGMA user_version").get().user_version;
  if (version > SCHEMA_VERSION) throw new Error(`Database schema ${version} is newer than this service supports`);
  const table = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'submissions'").get();
  if (version >= SCHEMA_VERSION || !table || !/UNIQUE\s*\(\s*kind\s*,\s*dedupe_key\s*\)/iu.test(table.sql)) return;

  // Version 1 used a hard uniqueness constraint before email ownership could
  // be verified. Rebuild both related tables so FK references remain valid.
  db.exec("PRAGMA foreign_keys = OFF");
  try {
    db.exec("BEGIN IMMEDIATE");
    const hasIdempotency = db.prepare("SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = 'idempotency_keys'").get();
    db.exec("ALTER TABLE submissions RENAME TO submissions_legacy");
    if (hasIdempotency) db.exec("ALTER TABLE idempotency_keys RENAME TO idempotency_keys_legacy");
    db.exec(SUBMISSIONS_SCHEMA);
    db.exec(IDEMPOTENCY_SCHEMA);
    db.exec(`
      INSERT INTO submissions (id, kind, created_at, full_name, email, affiliation, details_json, dedupe_key)
      SELECT id, kind, created_at, full_name, email, affiliation, details_json, dedupe_key FROM submissions_legacy;
    `);
    if (hasIdempotency) {
      db.exec(`
        INSERT INTO idempotency_keys (kind, key, request_hash, submission_id, created_at)
        SELECT kind, key, request_hash, submission_id, created_at FROM idempotency_keys_legacy;
      `);
    }
    db.exec("DROP TABLE IF EXISTS idempotency_keys_legacy; DROP TABLE submissions_legacy;");
    const violations = db.prepare("PRAGMA foreign_key_check").all();
    if (violations.length > 0) throw new Error("Legacy database migration failed its foreign-key check");
    db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}; COMMIT;`);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.exec("PRAGMA foreign_keys = ON");
  }
}

function publicRow(row) {
  if (!row) return null;
  const details = JSON.parse(row.details_json);
  const result = {
    id: row.id,
    kind: row.kind,
    createdAt: row.created_at,
    fullName: row.full_name,
    email: row.email,
    affiliation: row.affiliation,
    duplicateCount: row.duplicate_count === undefined ? undefined : row.duplicate_count,
  };
  if (row.kind === "conference") {
    result.role = details.role;
    result.dates = details.dates;
  } else {
    result.title = details.title;
    result.authors = details.authors;
    result.topic = details.topic;
    result.abstract = details.abstract || null;
    result.uploadStatus = details.pdf ? "complete" : (details.abstract ? "legacy-abstract" : "pending");
    result.pdfFileName = details.pdf?.originalName || null;
    result.pdfSize = details.pdf?.size || null;
    result.pdfSha256 = details.pdf?.sha256 || null;
  }
  return result;
}

export class RegistrationStore {
  constructor(dataDirectory) {
    mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
    chmodSync(dataDirectory, 0o700);
    this.path = join(dataDirectory, "registrations.sqlite");
    this.db = new DatabaseSync(this.path);
    this.db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON; PRAGMA secure_delete = ON;");
    migrateSchema(this.db);
    this.db.exec(SUBMISSIONS_SCHEMA);
    this.db.exec(IDEMPOTENCY_SCHEMA);
    this.db.exec(UPLOAD_SESSION_SCHEMA);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS submissions_created_idx ON submissions (created_at DESC);
      CREATE INDEX IF NOT EXISTS submissions_dedupe_idx ON submissions (kind, dedupe_key);
      PRAGMA user_version = ${SCHEMA_VERSION};
    `);
    chmodSync(this.path, 0o600);
    this.db.prepare("DELETE FROM idempotency_keys WHERE created_at < ?").run(new Date(Date.now() - 30 * 86400000).toISOString());
  }

  findIdempotency(kind, key, requestHash) {
    const row = this.db.prepare("SELECT request_hash, submission_id FROM idempotency_keys WHERE kind = ? AND key = ?").get(kind, key);
    if (!row) return null;
    if (row.request_hash !== requestHash) return { conflict: true };
    return { reference: row.submission_id, replay: true };
  }

  create(kind, data, dedupeKey, idempotencyKey, requestHash) {
    const prefix = kind === "conference" ? "AIDP26-C" : "AIDP26-P";
    const id = `${prefix}-${randomBytes(6).toString("hex").toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const details = Object.fromEntries(DETAIL_FIELDS[kind].map((field) => [field, data[field]]));

    this.db.exec("BEGIN IMMEDIATE");
    try {
      const existing = this.findIdempotency(kind, idempotencyKey, requestHash);
      if (existing) {
        this.db.exec("COMMIT");
        return existing;
      }
      this.db.prepare(`
        INSERT INTO submissions (id, kind, created_at, full_name, email, affiliation, details_json, dedupe_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, kind, createdAt, data.fullName, data.email, data.affiliation, JSON.stringify(details), dedupeKey);
      this.db.prepare("INSERT INTO idempotency_keys (kind, key, request_hash, submission_id, created_at) VALUES (?, ?, ?, ?, ?)")
        .run(kind, idempotencyKey, requestHash, id, createdAt);
      this.db.exec("COMMIT");
      return { reference: id, replay: false };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  replaceUploadSession(id, tokenHash, expiresAt) {
    const row = this.db.prepare("SELECT kind, details_json FROM submissions WHERE id = ?").get(id);
    if (!row || row.kind !== "poster") return null;
    const details = JSON.parse(row.details_json);
    if (details.pdf) return { completed: true };
    this.db.prepare(`
      INSERT INTO upload_sessions (submission_id, token_hash, expires_at, created_at, completed_at)
      VALUES (?, ?, ?, ?, NULL)
      ON CONFLICT(submission_id) DO UPDATE SET
        token_hash = excluded.token_hash,
        expires_at = excluded.expires_at,
        created_at = excluded.created_at,
        completed_at = NULL
    `).run(id, tokenHash, expiresAt, new Date().toISOString());
    return { completed: false };
  }

  uploadSession(id) {
    const row = this.db.prepare(`
      SELECT submissions.id, submissions.details_json, upload_sessions.token_hash,
        upload_sessions.expires_at, upload_sessions.completed_at
      FROM upload_sessions
      JOIN submissions ON submissions.id = upload_sessions.submission_id
      WHERE submissions.id = ? AND submissions.kind = 'poster'
    `).get(id);
    if (!row) return null;
    return { ...row, details: JSON.parse(row.details_json) };
  }

  completePosterUpload(id, tokenHash, file) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const session = this.uploadSession(id);
      if (!session) {
        this.db.exec("ROLLBACK");
        return null;
      }
      if (session.token_hash !== tokenHash) {
        this.db.exec("ROLLBACK");
        return { tokenMismatch: true };
      }
      if (session.details.pdf) {
        this.db.exec("COMMIT");
        return { reference: id, replay: true };
      }
      const details = { ...session.details, pdf: file };
      this.db.prepare("UPDATE submissions SET details_json = ? WHERE id = ?").run(JSON.stringify(details), id);
      this.db.prepare("UPDATE upload_sessions SET completed_at = ? WHERE submission_id = ?").run(new Date().toISOString(), id);
      this.db.exec("COMMIT");
      return { reference: id, replay: false };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  posterFile(id) {
    const row = this.db.prepare("SELECT details_json FROM submissions WHERE id = ? AND kind = 'poster'").get(id);
    if (!row) return null;
    return JSON.parse(row.details_json).pdf || null;
  }

  allIds() {
    return new Set(this.db.prepare("SELECT id FROM submissions").all().map((row) => row.id));
  }

  expiredSubmissionIds(retentionDays) {
    const cutoff = new Date(Date.now() - retentionDays * 86400000).toISOString();
    return this.db.prepare("SELECT id FROM submissions WHERE created_at < ?").all(cutoff).map((row) => row.id);
  }

  deleteSubmission(id) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("DELETE FROM idempotency_keys WHERE submission_id = ?").run(id);
      this.db.prepare("DELETE FROM upload_sessions WHERE submission_id = ?").run(id);
      const deleted = this.db.prepare("DELETE FROM submissions WHERE id = ?").run(id).changes;
      this.db.exec("COMMIT");
      return deleted > 0;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  list({ kind, limit = 100, offset = 0 } = {}) {
    const where = kind ? "WHERE kind = ?" : "";
    const params = kind ? [kind] : [];
    const total = this.db.prepare(`SELECT COUNT(*) AS count FROM submissions ${where}`).get(...params).count;
    const rows = this.db.prepare(`
      SELECT submissions.*,
        (SELECT COUNT(*) FROM submissions AS duplicates
          WHERE duplicates.kind = submissions.kind AND duplicates.dedupe_key = submissions.dedupe_key) AS duplicate_count
      FROM submissions ${where} ORDER BY created_at DESC, rowid DESC LIMIT ? OFFSET ?
    `).all(...params, limit, offset);
    return { total, items: rows.map(publicRow) };
  }

  all(kind) {
    const select = `
      SELECT submissions.*,
        (SELECT COUNT(*) FROM submissions AS duplicates
          WHERE duplicates.kind = submissions.kind AND duplicates.dedupe_key = submissions.dedupe_key) AS duplicate_count
      FROM submissions
    `;
    const rows = kind
      ? this.db.prepare(`${select} WHERE kind = ? ORDER BY created_at ASC, rowid ASC`).all(kind)
      : this.db.prepare(`${select} ORDER BY created_at ASC, rowid ASC`).all();
    return rows.map(publicRow);
  }

  purgeOlderThan(retentionDays) {
    const cutoff = new Date(Date.now() - retentionDays * 86400000).toISOString();
    let deleted;
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("DELETE FROM idempotency_keys WHERE submission_id IN (SELECT id FROM submissions WHERE created_at < ?)").run(cutoff);
      this.db.prepare("DELETE FROM upload_sessions WHERE submission_id IN (SELECT id FROM submissions WHERE created_at < ?)").run(cutoff);
      deleted = this.db.prepare("DELETE FROM submissions WHERE created_at < ?").run(cutoff).changes;
      this.db.prepare("DELETE FROM idempotency_keys WHERE created_at < ?").run(cutoff);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
    if (deleted > 0) this.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    return deleted;
  }

  counts() {
    const rows = this.db.prepare("SELECT kind, COUNT(*) AS count FROM submissions GROUP BY kind").all();
    return {
      conference: rows.find((row) => row.kind === "conference")?.count || 0,
      poster: rows.find((row) => row.kind === "poster")?.count || 0,
    };
  }

  close() {
    this.db.close();
  }
}
