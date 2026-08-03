// Gates the marketing site behind a shared password. /blog/ and the calculator
// stay public, as do the static assets and API routes they depend on.
export const config = {
  matcher: [
    "/((?!blog|unit-economics-calculator|_ds|assets|images|api|qr|sitemap.xml|robots.txt|favicon.ico).*)",
  ],
};

export default function middleware(request) {
  const expected = process.env.SITE_PASSWORD;

  if (!expected) {
    return new Response("SITE_PASSWORD is not configured for this deployment.", {
      status: 503,
      headers: { "content-type": "text/plain" },
    });
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    if (supplied === expected) return;
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="[tbd]", charset="UTF-8"',
      "content-type": "text/plain",
    },
  });
}
