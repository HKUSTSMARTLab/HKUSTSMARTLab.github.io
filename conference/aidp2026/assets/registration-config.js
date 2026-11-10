/*
 * Public browser configuration only — never put secret keys in this file.
 *
 * Same-origin deployment (recommended): leave apiBase empty and reverse-proxy
 * /api/aidp2026/* to the Node service.
 *
 * GitHub Pages deployment: set apiBase to the HTTPS API origin, for example
 * "https://aidp2026-api.example.org", then add this site's exact origin to
 * ALLOWED_ORIGINS on the API server.
 *
 * Local development automatically uses http://127.0.0.1:8787 when this page is
 * served from another localhost port.
 */
window.AIDP_REGISTRATION_CONFIG = {
  apiBase: "",
};
