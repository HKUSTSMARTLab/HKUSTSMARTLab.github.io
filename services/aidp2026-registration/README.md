# AIDP 2026 registration service

A deliberately small Node.js service for two independent workflows:

- conference attendance registration;
- poster submission with one PDF upload (maximum 5 MiB, private organizer-only storage).

It serves the existing static conference pages for local development and exposes a JSON API for a same-origin reverse proxy or a separate HTTPS API subdomain. SQLite stores submissions. There are no npm runtime dependencies.

## 1. Run locally

Requirements: Node.js 22.5 or newer (Node 24 LTS recommended for deployment).

```bash
cd services/aidp2026-registration
cp .env.example .env       # only if .env does not already exist
npm start
```

Open <http://127.0.0.1:8787/registration.html>. The service also serves the pages under `/conference/aidp2026/` for consistency with the repository layout.

For a project-local production start, keep `.env` for development and create `.env.production` beside it:

```bash
cp .env .env.production
chmod 0600 .env.production
# edit .env.production, then run:
NODE_ENV=production npm start
```

With `NODE_ENV=production`, the server reads `.env.production`; otherwise it reads `.env`. The data directory remains `services/aidp2026-registration/data/` unless `DATA_DIR` is set. The production systemd unit follows the same project-local layout and does not copy code to another directory.

The default `.env.example` uses Cloudflare's documented always-pass development keys. For automated tests of failure paths, use the failure keys from the official Turnstile documentation instead. Never use development keys in production.

Run the tests:

```bash
npm test
```

Tests use a temporary database and mocked CAPTCHA responses; they do not call live CAPTCHA services or modify real registrations.

## 2. Browser/API linkage

`conference/aidp2026/assets/registration-config.js` contains only public browser configuration:

```js
window.AIDP_REGISTRATION_CONFIG = {
  apiBase: "https://aidp2026-api.example.org",
};
```

- **Same-origin deployment (preferred):** leave `apiBase: ""` and proxy `/api/aidp2026/*` to Node.
- **GitHub Pages:** set the full HTTPS API origin. Add `https://hkustsmartlab.github.io` (and any custom site origin) to `ALLOWED_ORIGINS`.
- **Local static server:** when the page runs on another localhost port, the browser automatically tries `http://127.0.0.1:8787`.

Never put `TURNSTILE_SECRET_KEY`, Tencent `AppSecretKey`, CAM credentials, or `ADMIN_API_TOKEN` in browser JavaScript. Turnstile's **site key** and Tencent's **CaptchaAppId** are public identifiers and are safe to return from `/api/aidp2026/config`.

## 3. API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/aidp2026/health` | Minimal liveness response |
| GET | `/api/aidp2026/config` | Public deadlines and CAPTCHA site identifiers |
| POST | `/api/aidp2026/registrations` | Conference registration |
| POST | `/api/aidp2026/posters` | Validate poster metadata and create a short-lived PDF upload session |
| POST | `/api/aidp2026/posters/{id}/pdf` | Raw PDF upload with `X-Upload-Token`; maximum 5 MiB |
| GET | `/api/aidp2026/admin/submissions?kind=conference&limit=100&offset=0` | Paginated records; Bearer token required |
| GET | `/api/aidp2026/admin/submissions/{id}/pdf` | Private PDF download; Bearer token required |
| DELETE | `/api/aidp2026/admin/submissions/{id}` | Delete one record and its poster file; Bearer token required |
| GET | `/api/aidp2026/admin/export.csv?kind=poster` | CSV export; Bearer token required |
| GET | `/api/aidp2026/admin/debug` | Non-secret runtime diagnostics; Bearer token and debug switch required |

Metadata POST requests require `Content-Type: application/json` and an `Idempotency-Key` UUID header. A successful retry with the same key and identical normalized data returns the original reference without consuming another CAPTCHA ticket. Reusing a key for different data returns `409 IDEMPOTENCY_CONFLICT`.

Poster submission has two stages. Metadata validation returns `202` and a 15-minute, single-session upload token. The browser then POSTs the raw selected file with `Content-Type: application/pdf` and `X-Upload-Token`; no multipart encoding or base64 inflation is used. The server limits the stream to 5 MiB, checks the declared/actual byte count and `%PDF-` signature, computes SHA-256, and only then marks the submission complete. Pending-token renewal and completed-upload replays are idempotent. `%PDF-` is a format check, not malware detection; add an approved antivirus workflow if the organizers require it.

PDFs are named by submission reference, stored with private permissions under `DATA_DIR/uploads`, and never served as public static files. Admin downloads require the Bearer token. Retention cleanup removes both database records and files, with orphan cleanup for interrupted uploads.

The service returns a reference such as `AIDP26-C-…` or `AIDP26-P-…`. It does **not** send email. A completed poster response acknowledges receipt, not acceptance.

Because this minimal service does not verify email ownership, it does not let the first submission permanently reserve an email address or reveal whether that address is already registered. Repeat conference/poster candidates are accepted and marked with `duplicateCount` for administrator reconciliation. This prevents email squatting and attendee-status enumeration; idempotency keys still prevent accidental network/button retries. Organizers must review flagged records and confirm ownership operationally when necessary. Add a signed email-confirmation workflow before enabling hard uniqueness in a larger system.

On startup, schema version 1 databases are transactionally migrated to version 2, preserving submissions and idempotency records while removing the old hard uniqueness constraint. A foreign-key check runs before commit. Back up the database before an upgrade; the upgrade path has a dedicated preservation/migration test.

## 4. CAPTCHA configuration

### Cloudflare Turnstile

The browser uses explicit rendering. The backend POSTs every ticket to the official Siteverify endpoint and checks:

- `success`;
- the form-specific `action` when returned;
- `hostname` against `TURNSTILE_EXPECTED_HOSTNAMES`.

Tickets are valid for five minutes and single-use. The browser starts a new challenge after expiration and every submission attempt. Verification failures fail closed; provider/network failures return `503` rather than accepting a submission.

Production settings must include the actual public hostname:

```dotenv
TURNSTILE_ENABLED=true
TURNSTILE_SITE_KEY=public-site-key
TURNSTILE_SECRET_KEY=server-secret
TURNSTILE_EXPECTED_HOSTNAMES=hkustsmartlab.github.io
```

Also configure the same hostname in the Turnstile dashboard. Use separate documented test keys for localhost testing rather than adding localhost to a production widget.

### Tencent Captcha

The browser dynamically loads the official `TJCaptcha.js`. `trerror_…` disaster-recovery tickets are rejected rather than bypassing verification. The backend requires a valid ticket and `randstr`, and rejects a malicious risk result.

There are two different kinds of Tencent secret:

1. `TENCENT_CAPTCHA_SECRET_KEY`: the CAPTCHA application's **AppSecretKey**;
2. `TENCENT_SECRET_ID` / `TENCENT_SECRET_KEY`: CAM API credentials used to sign the current `DescribeCaptchaResult` TC3 request.

Recommended production configuration:

```dotenv
TENCENT_CAPTCHA_ENABLED=true
TENCENT_CAPTCHA_APP_ID=your-app-id
TENCENT_CAPTCHA_SECRET_KEY=your-app-secret-key
TENCENT_CAPTCHA_VERIFY_MODE=tc3
TENCENT_SECRET_ID=least-privilege-subaccount-secret-id
TENCENT_SECRET_KEY=least-privilege-subaccount-secret-key
```

Create a CAM subaccount with only the required CAPTCHA permission; do not use a root-account key. `TENCENT_SECURITY_TOKEN` is also supported for temporary CAM credentials.

For a temporary account that has only CaptchaAppId/AppSecretKey, `TENCENT_CAPTCHA_VERIFY_MODE=legacy` uses the app-key compatibility ticket endpoint. In non-production, `auto` chooses TC3 when CAM credentials exist and legacy mode otherwise. Production rejects `auto`: choose `tc3`, or temporarily set both `legacy` and `TENCENT_ALLOW_LEGACY=true` while migrating. Partial CAM credentials are a startup error. Migrate to TC3 for production.

`CAPTCHA_PROVIDER=auto` lets the browser offer both enabled providers. At a trusted edge, the API recommends Tencent only when the country code is `CN` (mainland China), and Turnstile for `HK`, `MO`, `TW`, and all other known countries. Set `GEO_PROVIDER=cloudflare` to read `CF-IPCountry`, or `GEO_PROVIDER=edgeone` to read `EO-Client-IPCountry`; `GEO_COUNTRY_HEADER` can override the header name. Headers are accepted only from an exact `TRUST_PROXY_IPS` peer. Unknown/unavailable geography returns `auto`, where `zh-CN` is only a browser-language fallback. Visitors can always switch manually, and country information is not stored. Set `CAPTCHA_PROVIDER=turnstile` or `tencent` to pin the initial provider while retaining the other as a fallback.

## 5. Administrator usage and safe debugging

Generate a new token before deployment:

```bash
openssl rand -hex 32
```

Set it as `ADMIN_API_TOKEN` in the server's protected environment file. Examples below assume the shell variable contains that token:

```bash
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  http://127.0.0.1:8787/api/aidp2026/admin/debug

curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  'http://127.0.0.1:8787/api/aidp2026/admin/submissions?kind=poster&limit=100'

curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -o aidp2026-posters.csv \
  'http://127.0.0.1:8787/api/aidp2026/admin/export.csv?kind=poster'

curl -X DELETE \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  http://127.0.0.1:8787/api/aidp2026/admin/submissions/AIDP26-P-000000000000
```

CSV exports prefix spreadsheet-formula-leading cells to reduce CSV injection risk. Exports contain personal data: store them encrypted, restrict access, and delete them according to the organizers' retention policy.

For local development only, an administrator can explicitly bypass CAPTCHA when **all** of these conditions hold:

- `DEBUG_ADMIN_ENABLED=true`;
- `DEBUG_ALLOW_CAPTCHA_BYPASS=true`;
- `NODE_ENV` is not `production`;
- `TRUST_PROXY=0` (a proxied staging deployment cannot use the bypass);
- the direct socket is loopback (not merely a spoofed forwarded IP);
- the request has the valid admin Bearer token and `X-Admin-Debug: bypass-captcha`.

Production code ignores the bypass switches. Admin list/export endpoints still work in production, and `/admin/debug` can be enabled independently without enabling a CAPTCHA bypass. Do not expose the debug endpoint publicly without HTTPS and a strong token.

## 6. Abuse resistance and DDoS boundary

Application-level protections included:

- strict per-IP API and submission rate limits with `Retry-After`;
- bounded in-memory rate-limit tables and CAPTCHA concurrency;
- 32 KiB JSON metadata limit, a separate 5 MiB streaming PDF limit, and request/header timeouts;
- field allowlists, length limits, enum/date validation, and duplicate flagging;
- honeypot and basic form timing signals (supplemental bot heuristics, not DDoS controls);
- origin allowlist/CORS for public routes, no browser CORS for admin routes, and no cookies;
- admin Bearer authentication and constant-time token comparison;
- no CAPTCHA tickets, IP addresses, or secrets stored in registration records;
- atomic SQLite writes, idempotency keys, and non-blocking duplicate reconciliation;
- bounded connections and automatic live-record retention cleanup.

These controls reduce abuse but **cannot stop a volumetric or distributed DDoS attack**. In-memory limits are per Node process, not a multi-replica global limit.

`RETENTION_DAYS=180` is the default live-data retention period. Cleanup runs at startup and every six hours, removes expired submissions and related idempotency rows, uses SQLite `secure_delete`, and checkpoints the WAL after purges. Adjust the value only after the organizers approve the policy. This does not erase administrator exports, off-site backups, or old snapshots: apply the same approved retention schedule there. Encrypt the host volume and backups, include WAL/snapshot files in the policy, and test restoration. SQLite remains plaintext inside the service account's protected data directory unless the underlying storage is encrypted.

### Cloudflare edge (recommended for the existing GitHub Pages site)

1. Deploy the API behind an HTTPS hostname and set that hostname's DNS record to **Proxied** (orange cloud). Turnstile alone does not enable DDoS protection.
2. Keep Cloudflare's automatic DDoS protection and WAF enabled. Add a rate-limiting rule for the API POST paths, starting conservatively (for example 10 requests per 10 seconds per IP with a temporary block) and tune for legitimate shared/NAT networks. Enable **Network → IP Geolocation** (available on all plans) and set `GEO_PROVIDER=cloudflare` so `/config` can recommend Tencent for `CN` and Turnstile elsewhere.
3. Cache static assets at the edge, but bypass cache for every `/api/aidp2026/*` route, especially admin/config/responses.
4. Restrict the origin firewall/security group to Cloudflare IP ranges and HTTPS from the reverse proxy. Do not leave a direct public origin path that bypasses the edge.
5. Install `deploy/nginx-cloudflare-real-ip.conf.example` as the Nginx real-IP configuration and refresh its official Cloudflare CIDRs periodically. The example Nginx configuration trusts only those ranges for `CF-Connecting-IP`, then overwrites `X-Forwarded-For` with the sanitized `$remote_addr` instead of appending an attacker-controlled chain. This also makes Nginx rate limits use the visitor IP rather than a Cloudflare edge IP.
6. With exactly one trusted Nginx hop, set `TRUST_PROXY=1`. `TRUST_PROXY_IPS` must contain the exact direct proxy peer IPs (loopback is the safe default); forwarded headers from every other peer are ignored. Do not increase the hop count to compensate for an unsanitized chain.
7. Monitor Security Events, origin 429/5xx rates, CAPTCHA failures, duplicate flags, and submission counts. During an attack, tighten edge rules or temporarily challenge/block the API rather than disabling server-side verification.

### Tencent EdgeOne alternative

For a China Mainland-oriented deployment, onboard the API hostname to EdgeOne with a CNAME, configure HTTPS origin pull, enable the available L3/L4 and HTTP DDoS protection, and add WAF/rate-limit rules for the two POST endpoints. Enable the **Client IP location Header** with the name `EO-Client-IPCountry` and set `GEO_PROVIDER=edgeone`. EdgeOne currently documents that country lookup does not support IPv6, so some visitors may use the fallback selection. Mainland acceleration can require ICP filing. Subscribe to higher DDoS protection only if the event's risk and traffic require it. Apply the same origin-firewall and monitoring rules as above.

The CAPTCHA keys in `.env` do not authorize changes to either provider's DDoS settings. Those changes require access to the relevant Cloudflare zone or Tencent EdgeOne console.

## 7. Production checklist

- Set `NODE_ENV=production` exactly (other values are rejected), a unique strong `ADMIN_API_TOKEN`, and `DEBUG_ALLOW_CAPTCHA_BYPASS=false`. Startup refuses published Turnstile test keys and the example admin token.
- Replace temporary/test CAPTCHA credentials and rotate any secret that has been shared in chat or logs.
- Set the real `ALLOWED_ORIGINS`, `TURNSTILE_EXPECTED_HOSTNAMES`, and browser `apiBase` values.
- Use HTTPS end-to-end and a supported Node LTS release.
- Put `DATA_DIR` on persistent storage owned by the service account with mode `0700`; the database file is set to `0600`.
- Back up SQLite and `DATA_DIR/uploads` safely and test restores. Do not place either below the static web root. Encrypt the host volume and backups.
- Set `REGISTRATION_OPEN` and `CONFERENCE_DEADLINE` explicitly. The poster deadline defaults to the announced 13 November 2026 date and is enforced by the server.
- Keep the static `services/` directory excluded from Jekyll. The repository `_config.yml` already does this; `.env` and `data/` are also git-ignored.
- Do not collect patient-identifiable data in poster PDFs. Agree on a privacy contact, correction/deletion workflow, and the default 180-day `RETENTION_DAYS` policy before launch; apply retention to exports and backups too.
- Use the example Nginx and systemd units in `deploy/` as starting points, then adapt hostnames, paths, certificates, and firewall policy.

## Official integration references

- Cloudflare Turnstile server validation: <https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>
- Cloudflare Turnstile test keys: <https://developers.cloudflare.com/turnstile/troubleshooting/testing/>
- Cloudflare DDoS protection: <https://developers.cloudflare.com/ddos-protection/>
- Cloudflare IP geolocation: <https://developers.cloudflare.com/network/ip-geolocation/>
- Tencent Web client integration: <https://cloud.tencent.com/document/product/1110/36841>
- Tencent `DescribeCaptchaResult`: <https://cloud.tencent.com/document/product/1110/36926>
- Tencent CAPTCHA result handling: <https://cloud.tencent.com/document/product/1110/84005>
- Tencent EdgeOne DDoS configuration: <https://cloud.tencent.com/document/product/1552/95994>
- Tencent EdgeOne client country header: <https://cloud.tencent.com/document/product/1552/80978>
- Step-by-step Chinese deployment guide: `DEPLOYMENT.zh-CN.md`
