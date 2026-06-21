// Vercel serverless function — /api/unsubscribe?token=<uuid>
// Marks a subscriber as unsubscribed. Handles both the GET link click (shows a
// confirmation page) and the RFC 8058 one-click POST from Gmail / Apple Mail.
//
// Uses the same SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars as subscribe.mjs.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  const token = String((req.query && req.query.token) || "").trim();

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).send("Method not allowed");
  }

  if (!UUID_RE.test(token)) {
    return sendPage(res, req, 400, "Invalid link", "This unsubscribe link is malformed or incomplete.");
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase env vars");
    return sendPage(res, req, 500, "Something went wrong", "We couldn't process that right now. Please try again later.");
  }

  try {
    const url =
      `${SUPABASE_URL}/rest/v1/subscribers` +
      `?unsubscribe_token=eq.${encodeURIComponent(token)}`;
    const dbResp = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ unsubscribed_at: new Date().toISOString() }),
    });

    if (!dbResp.ok) {
      console.error("Supabase unsubscribe failed", dbResp.status, await dbResp.text());
      return sendPage(res, req, 502, "Something went wrong", "We couldn't process that right now. Please try again later.");
    }

    // One-click clients (POST) just need a 200 — no page.
    if (req.method === "POST") return res.status(200).json({ ok: true });

    return sendPage(
      res, req, 200,
      "You're unsubscribed",
      "You won't receive any more emails from [tbd] Dispatches. Changed your mind? You can resubscribe anytime from the site."
    );
  } catch (err) {
    console.error("Unsubscribe request error", err);
    return sendPage(res, req, 502, "Something went wrong", "We couldn't process that right now. Please try again later.");
  }
}

function siteBaseUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function sendPage(res, req, status, heading, body) {
  const home = siteBaseUrl(req) + "/";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(status).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${heading} — [tbd] Dispatches</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0a;">
  <div style="max-width:440px;padding:48px 32px;text-align:center;">
    <p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#1f4bff;margin:0 0 20px;">[tbd] Dispatches</p>
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.01em;margin:0 0 12px;">${heading}</h1>
    <p style="font-size:16px;line-height:1.6;color:#3a3a3a;margin:0 0 28px;">${body}</p>
    <a href="${home}" style="display:inline-block;padding:11px 22px;border:1px solid #ddd9d0;border-radius:999px;color:#0a0a0a;text-decoration:none;font-size:13px;letter-spacing:0.04em;">Back to the site</a>
  </div>
</body>
</html>`);
}
