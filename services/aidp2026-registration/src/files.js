import { createHash, randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { chmodSync, lstatSync, mkdirSync, readdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import { once } from "node:events";
import { join } from "node:path";
import { HttpError } from "./validation.js";

const POSTER_ID = /^AIDP26-P-[0-9A-F]{12}$/u;

function unlinkIfPresent(path) {
  try {
    unlinkSync(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function discardRequestBody(request, maxBytes) {
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw new HttpError(413, "BODY_TOO_LARGE", "The request body is too large.");
  }
  return size;
}

export class PosterFileStorage {
  constructor(dataDirectory) {
    this.directory = join(dataDirectory, "uploads");
    mkdirSync(this.directory, { recursive: true, mode: 0o700 });
    chmodSync(this.directory, 0o700);
  }

  pathFor(id) {
    if (!POSTER_ID.test(id)) throw new HttpError(404, "NOT_FOUND", "Not found.");
    return join(this.directory, `${id}.pdf`);
  }

  async save(request, { id, expectedSize, maxBytes }) {
    const contentType = String(request.headers["content-type"] || "").split(";", 1)[0].trim().toLowerCase();
    if (contentType !== "application/pdf") throw new HttpError(415, "PDF_REQUIRED", "Upload one PDF file.");
    const declaredLength = Number(request.headers["content-length"] || 0);
    if (declaredLength > maxBytes) throw new HttpError(413, "PDF_TOO_LARGE", "The PDF exceeds the 5 MB limit.");
    if (declaredLength > 0 && declaredLength !== expectedSize) {
      throw new HttpError(400, "PDF_SIZE_MISMATCH", "The selected file changed before upload. Select it again.");
    }

    const temporaryPath = join(this.directory, `${id}.${randomUUID()}.tmp`);
    const finalPath = this.pathFor(id);
    const output = createWriteStream(temporaryPath, { flags: "wx", mode: 0o600 });
    const finished = once(output, "finish");
    const hash = createHash("sha256");
    const header = [];
    let headerLength = 0;
    let size = 0;
    let streamError = null;
    output.on("error", (error) => { streamError = error; });

    try {
      for await (const chunk of request) {
        if (streamError) throw streamError;
        size += chunk.length;
        if (size > maxBytes) throw new HttpError(413, "PDF_TOO_LARGE", "The PDF exceeds the 5 MB limit.");
        if (headerLength < 5) {
          const needed = Math.min(5 - headerLength, chunk.length);
          header.push(chunk.subarray(0, needed));
          headerLength += needed;
        }
        hash.update(chunk);
        if (!output.write(chunk)) await once(output, "drain");
      }
      output.end();
      await finished;
      if (streamError) throw streamError;

      if (size !== expectedSize) throw new HttpError(400, "PDF_SIZE_MISMATCH", "The selected file changed before upload. Select it again.");
      if (size < 8 || Buffer.concat(header).subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw new HttpError(415, "INVALID_PDF", "The uploaded file is not a valid PDF document.");
      }
      // The session is still pending, so replacing an orphan left by a
      // process crash is safe and makes the retry self-healing.
      renameSync(temporaryPath, finalPath);
      return { size, sha256: hash.digest("hex") };
    } catch (error) {
      output.destroy();
      unlinkIfPresent(temporaryPath);
      throw error;
    }
  }

  get(id) {
    const path = this.pathFor(id);
    try {
      if (lstatSync(path).isSymbolicLink()) throw new HttpError(404, "NOT_FOUND", "Not found.");
      return { path, size: statSync(path).size };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(404, "NOT_FOUND", "Not found.");
    }
  }

  remove(id) {
    unlinkIfPresent(this.pathFor(id));
  }

  cleanup(validIds, olderThanMs = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - olderThanMs;
    for (const name of readdirSync(this.directory)) {
      const isPoster = POSTER_ID.test(name.replace(/\.pdf$/u, ""));
      const isTemporary = name.endsWith(".tmp");
      if (!isPoster && !isTemporary) continue;
      const id = name.split(".")[0];
      const path = join(this.directory, name);
      const stats = statSync(path);
      if (stats.mtimeMs < cutoff && (isTemporary || !validIds.has(id))) unlinkIfPresent(path);
    }
  }
}
