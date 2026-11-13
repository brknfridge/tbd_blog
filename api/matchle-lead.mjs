// Vercel serverless function — POST /api/matchle-lead
// Stores a Matchle "reach out with potential matches" request in Supabase.
// Zero dependencies, same pattern as subscribe.mjs.
//
// Required environment variables (already set for the newsletter):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   server-only secret — never expose
//   RESEND_API_KEY              sends the follow-up email (api/_lib/matchle-email.mjs)
//                               to each new email address, once.
// Optional:
//   MATCHLE_FROM                From header for the follow-up, default
//                               NEWSLETTER_FROM, else Resend's test sender.
//   MATCHLE_NOTIFY_TO           e.g. connect@tbdonline.in — each lead is also
//                               emailed there.
//   SITE_URL                    Base URL for unsubscribe links.
//
// Table: public.matchle_leads — see supabase/schema.sql.

import { SUBJECT, render } from "./_lib/matchle-email.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;

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

  // Honeypot: people never see this field. Pretend it worked so bots move on.
  if (body.company) return res.status(200).json({ ok: true });

  const name = String(body.name || "").trim().replace(/\s+/g, " ").slice(0, 80);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 120);
  const phone = String(body.phone || "").replace(/[\s().-]/g, "");
  // The brief is the page's own query string (?sex=f&aMin=25…), capped.
  const brief = String(body.brief || "").slice(0, 600);
  const r = body.result && typeof body.result === "object" ? body.result : {};

  // "email": the idle lightbox, email only. "full" (default): the Done
  // pop-up, which also needs a name and phone.
  const kind = body.kind === "email" ? "email" : "full";

  if (kind === "full" && name.length < 2) return res.status(400).json({ error: "Tell us your name." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (kind === "full" && !PHONE_RE.test(phone)) return res.status(400).json({ error: "Enter a phone number with 7 to 15 digits." });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase env vars");
    return res.status(500).json({ error: "Server is not configured." });
  }

  const row = {
    kind,
    name: name || null,
    email,
    phone: kind === "full" ? phone : null,
    brief,
    city: str(r.city, 40),
    looking_for: str(r.looking_for, 10),
    matches: int(r.matches),
    weeks: int(r.weeks),
  };

  const sb = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };

  // Has this address signed up before? Then it already has the follow-up
  // email, so don't send it twice. A failed lookup just means we send it.
  let firstTime = true;
  try {
    const seen = await fetch(
      `${SUPABASE_URL}/rest/v1/matchle_leads?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
      { headers: sb },
    );
    if (seen.ok) firstTime = (await seen.json()).length === 0;
  } catch (err) {
    console.error("Supabase lookup error", err);
  }

  let unsubscribeToken = null;
  try {
    const dbResp = await fetch(`${SUPABASE_URL}/rest/v1/matchle_leads`, {
      method: "POST",
      headers: { ...sb, Prefer: "return=representation" },
      body: JSON.stringify([row]),
    });
    if (dbResp.ok) {
      const rows = await dbResp.json().catch(() => []);
      unsubscribeToken = rows[0] && rows[0].unsubscribe_token;
    } else {
      console.error("Supabase insert failed", dbResp.status, await dbResp.text());
      return res.status(502).json({ error: "Could not save your details. Try again." });
    }
  } catch (err) {
    console.error("Supabase request error", err);
    return res.status(502).json({ error: "Could not save your details. Try again." });
  }

  // Emails never fail the request — the lead is already saved.
  const { RESEND_API_KEY, MATCHLE_NOTIFY_TO } = process.env;
  if (RESEND_API_KEY && firstTime) {
    try {
      const base = siteBaseUrl(req);
      const unsubscribeUrl = unsubscribeToken
        ? `${base}/api/unsubscribe?list=matchle&token=${unsubscribeToken}`
        : `mailto:connect@tbdonline.in?subject=Unsubscribe%20from%20Matchle`;
      await sendFollowUp(email, RESEND_API_KEY, unsubscribeUrl);
    } catch (err) {
      console.error("Resend follow-up error", err);
    }
  }
  if (RESEND_API_KEY && MATCHLE_NOTIFY_TO) {
    try {
      await notify(row, RESEND_API_KEY, MATCHLE_NOTIFY_TO);
    } catch (err) {
      console.error("Resend notify error", err);
    }
  }

  return res.status(200).json({ ok: true });
}

function str(v, max) {
  return v == null ? null : String(v).slice(0, max);
}
function int(v) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : null;
}

function siteBaseUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

async function sendFollowUp(to, apiKey, unsubscribeUrl) {
  const from = process.env.MATCHLE_FROM || process.env.NEWSLETTER_FROM || "[tbd] <onboarding@resend.dev>";
  const { html, text } = render(unsubscribeUrl);
  const headers = unsubscribeUrl.startsWith("http")
    ? { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
    : undefined;
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: SUBJECT, html, text, headers }),
  });
  if (!resp.ok) throw new Error(`Resend ${resp.status}: ${await resp.text()}`);
}

async function notify(row, apiKey, to) {
  const from = process.env.NEWSLETTER_FROM || "[tbd] <onboarding@resend.dev>";
  const text = [
    "New Matchle lead",
    "",
    `Source:  ${row.kind === "email" ? "Email lightbox" : "Done pop-up"}`,
    `Name:    ${row.name || "-"}`,
    `Email:   ${row.email}`,
    `Phone:   ${row.phone || "-"}`,
    `City:    ${row.city || "-"}`,
    `Looking: ${row.looking_for || "-"}`,
    `Matches: ${row.matches ?? "-"} · ${row.weeks ?? "-"} weeks`,
    "",
    `Brief:   https://tbdonline.in/matchle/${row.brief ? "?" + row.brief : ""}`,
  ].join("\n");
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: row.email, subject: `Matchle lead: ${row.name || row.email}`, text }),
  });
  if (!resp.ok) throw new Error(`Resend ${resp.status}: ${await resp.text()}`);
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
