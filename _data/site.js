// Global site metadata. `url` (used for canonical links + schema.org) is filled
// in automatically at build time from the host's env vars — Netlify or Vercel.
// Locally, or on an unknown host, it falls back to localhost.
function resolveSiteUrl() {
  // Netlify: production/branch URL
  if (process.env.URL) return process.env.URL;
  // Vercel: stable production domain (set on production deploys)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // Vercel: per-deploy preview URL (fallback for preview builds)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

module.exports = {
  url: resolveSiteUrl(),
  name: "[tbd] Dispatches",
  publisher: "[tbd]",
  description:
    "A growth journal — precise, confident, in motion. Essays on marketing that compounds.",
};
