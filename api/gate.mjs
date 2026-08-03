// Vercel serverless function — POST /api/gate
// Validates the shared site password and issues the cookie that middleware.js
// checks before serving the gated marketing pages.
//
// Required environment variables (set in Vercel → Settings → Environment Variables):
//   SITE_PASSWORD   shared password for the pre-launch marketing pages
//
// The cookie holds sha256(SITE_PASSWORD) rather than the password itself, so a
// stolen cookie can't be read back into the password. Middleware derives the
// same digest from the env var, which keeps the check stateless.

import { createHash, timingSafeEqual } from "node:crypto";

const MAX_AGE = 60 * 60 * 24 * 7;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    return res.status(503).json({ error: "Site password is not configured." });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }

  const supplied = typeof body.password === "string" ? body.password : "";

  if (!equals(supplied, expected)) {
    return res.status(401).json({ ok: false });
  }

  const token = createHash("sha256").update(expected).digest("hex");
  res.setHeader(
    "Set-Cookie",
    `tbd_gate=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
  );
  return res.status(200).json({ ok: true });
}

function equals(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
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
