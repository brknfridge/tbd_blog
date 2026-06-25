// Vercel serverless function — GET /qr
// Issues a 302 redirect to the URL stored in QR_REDIRECT_URL.
//
// To change the destination:
//   Vercel dashboard → Project → Settings → Environment Variables
//   → update QR_REDIRECT_URL → Deployments → Redeploy latest
//
// Required environment variable:
//   QR_REDIRECT_URL   The full URL to redirect visitors to.
//                     e.g. https://www.youtube.com/@tbdonline

const FALLBACK_URL = "https://tbdonline.in";

export default function handler(req, res) {
  const destination = process.env.QR_REDIRECT_URL || FALLBACK_URL;
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, destination);
}
