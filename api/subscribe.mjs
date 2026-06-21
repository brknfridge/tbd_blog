// Vercel serverless function — POST /api/subscribe
// Stores a newsletter signup in Supabase and sends a welcome email via Resend.
// Zero dependencies: talks to both services over their REST APIs with fetch.
//
// Required environment variables (set in Vercel → Settings → Environment Variables):
//   SUPABASE_URL                e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   service_role key (server-only secret — never expose)
//   RESEND_API_KEY              re_xxx from resend.com
// Optional:
//   NEWSLETTER_FROM             From header, default uses Resend's test sender
//                               e.g. "[tbd] Dispatches <hello@tbdonline.in>"
//   SITE_URL                    Base URL for unsubscribe links; defaults to the
//                               request host. e.g. https://tbdonline.in

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const source = String(body.source || "site").slice(0, 40);

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase env vars");
    return res.status(500).json({ error: "Server is not configured." });
  }

  // Insert. The unique email index turns repeat signups into a 409, which we
  // treat as success (idempotent) and skip the welcome email. return=representation
  // hands back the new row's unsubscribe_token for the email's unsubscribe link.
  let isNew = false;
  let unsubscribeToken = null;
  try {
    const dbResp = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([{ email, source }]),
    });

    if (dbResp.status === 201) {
      isNew = true;
      const rows = await dbResp.json().catch(() => []);
      unsubscribeToken = rows[0] && rows[0].unsubscribe_token;
    } else if (dbResp.status === 409) {
      isNew = false; // already subscribed
    } else {
      const detail = await dbResp.text();
      console.error("Supabase insert failed", dbResp.status, detail);
      return res.status(502).json({ error: "Could not save your signup." });
    }
  } catch (err) {
    console.error("Supabase request error", err);
    return res.status(502).json({ error: "Could not save your signup." });
  }

  // Send the welcome email only for genuinely new subscribers. A failure here
  // must not fail the signup — the address is already stored.
  if (isNew && RESEND_API_KEY) {
    try {
      const base = siteBaseUrl(req);
      const unsubscribeUrl = unsubscribeToken
        ? `${base}/api/unsubscribe?token=${unsubscribeToken}`
        : `${base}/`;
      await sendWelcomeEmail(email, RESEND_API_KEY, unsubscribeUrl);
    } catch (err) {
      console.error("Resend send error", err);
    }
  }

  return res.status(200).json({ ok: true, isNew });
}

function siteBaseUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

async function sendWelcomeEmail(to, apiKey, unsubscribeUrl) {
  const from = process.env.NEWSLETTER_FROM || "[tbd] Dispatches <onboarding@resend.dev>";
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "You're on the list — [tbd] Dispatches",
      html: welcomeHtml(unsubscribeUrl),
      text: welcomeText(unsubscribeUrl),
      // One-click unsubscribe in Gmail / Apple Mail (RFC 8058). Improves
      // deliverability and keeps you compliant.
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Resend ${resp.status}: ${await resp.text()}`);
  }
}

function welcomeHtml(unsubscribeUrl) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0a;">
    <div style="max-width:520px;margin:0 auto;padding:48px 32px;">
      <p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#1f4bff;margin:0 0 24px;">[tbd] Dispatches</p>
      <h1 style="font-size:26px;font-weight:600;letter-spacing:-0.01em;margin:0 0 16px;">You're on the list.</h1>
      <p style="font-size:16px;line-height:1.65;color:#3a3a3a;margin:0 0 16px;">
        Thanks for subscribing. You'll get dispatches on positioning, growth, and
        the marketing work that pays you back long after launch day — sent only
        when there's something worth saying.
      </p>
      <p style="font-size:16px;line-height:1.65;color:#3a3a3a;margin:0 0 32px;">
        No filler, no weekly cadence for its own sake.
      </p>
      <hr style="border:none;border-top:1px solid #ddd9d0;margin:0 0 24px;">
      <p style="font-size:13px;line-height:1.6;color:#8a8678;margin:0;">
        You received this because you signed up at tbdonline.in.
        <a href="${unsubscribeUrl}" style="color:#8a8678;text-decoration:underline;">Unsubscribe</a>.
      </p>
    </div>
  </body>
</html>`;
}

function welcomeText(unsubscribeUrl) {
  return [
    "[tbd] Dispatches",
    "",
    "You're on the list.",
    "",
    "Thanks for subscribing. You'll get dispatches on positioning, growth, and the marketing work that pays you back long after launch day — sent only when there's something worth saying.",
    "",
    "No filler, no weekly cadence for its own sake.",
    "",
    "You received this because you signed up at tbdonline.in.",
    "Unsubscribe: " + unsubscribeUrl,
  ].join("\n");
}

async function readJson(req) {
  if (req.body !== undefined && req.body !== null && req.body !== "") {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}
