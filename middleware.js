// Gates the marketing site behind a shared password. /blog/ and the calculator
// stay public, as do the static assets and API routes they depend on.
//
// The gate is served instead of the page, never on top of it — the real markup
// only reaches the browser once the cookie checks out, so the blur is a curtain
// in front of an empty room rather than a sheet over readable content.
export const config = {
  matcher: [
    "/((?!blog|unit-economics-calculator|_ds|assets|images|api|qr|sitemap.xml|robots.txt|favicon.ico).*)",
  ],
};

const DS = "/_ds/tbd-design-system-3a5dc6ab-3b87-4bfb-a5fd-020b5cb2c164/styles.css";

export default async function middleware(request) {
  const expected = process.env.SITE_PASSWORD;

  if (!expected) {
    return new Response("SITE_PASSWORD is not configured for this deployment.", {
      status: 503,
      headers: { "content-type": "text/plain" },
    });
  }

  const cookies = request.headers.get("cookie") || "";
  const token = /(?:^|;\s*)tbd_gate=([a-f0-9]{64})(?:;|$)/.exec(cookies);

  if (token && token[1] === (await sha256Hex(expected))) return;

  return new Response(gatePage(), {
    status: 401,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function gatePage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>[tbd] · Private preview</title>
<link rel="stylesheet" href="${DS}" />
<style>
  html, body { height: 100%; }
  body {
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  /* Stand-in for the page behind the gate. Decorative only — it holds no real
     copy, which is the point. It fades out as the real page loads. */
  .gate-behind {
    position: fixed;
    inset: -20vmin;
    background:
      linear-gradient(148deg,
        var(--tbd-color-blue) 0%,
        rgba(31, 75, 255, 0.35) 26%,
        var(--tbd-color-paper) 52%,
        rgba(14, 124, 90, 0.32) 78%,
        var(--tbd-color-ink) 100%);
    opacity: 0.55;
    transition: opacity 900ms ease;
    pointer-events: none;
  }

  .gate-card {
    position: relative;
    width: min(440px, calc(100vw - 40px));
    padding: var(--tbd-space-8);
    background: var(--tbd-color-pure);
    border: var(--tbd-border-hairline) solid var(--tbd-rule);
    border-radius: var(--tbd-radius-md);
    box-shadow: 0 24px 80px rgba(10, 10, 10, 0.16);
    transition: opacity 420ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gate-mark { font-size: 24px; margin: 0 0 var(--tbd-space-6); }
  .gate-title {
    /* --tbd-size-display-sm is 64px — too tall for a 440px card. */
    font-size: 34px;
    line-height: 1.08;
    margin: var(--tbd-space-3) 0 var(--tbd-space-2);
  }
  .gate-copy { color: var(--tbd-text-muted); margin-bottom: var(--tbd-space-6); }

  .gate-field { display: flex; gap: var(--tbd-space-2); }
  .gate-input {
    flex: 1;
    min-width: 0;
    font-family: var(--tbd-font-sans);
    font-size: var(--tbd-size-body-sm);
    padding: var(--tbd-space-3) var(--tbd-space-4);
    color: var(--tbd-text);
    background: var(--tbd-color-paper);
    border: var(--tbd-border-hairline) solid var(--tbd-rule);
    border-radius: var(--tbd-radius-sm);
  }
  .gate-submit { border-radius: var(--tbd-radius-sm); }

  .gate-msg {
    min-height: 18px;
    margin-top: var(--tbd-space-3);
    color: var(--tbd-color-red);
  }

  .gate-foot {
    margin-top: var(--tbd-space-6);
    padding-top: var(--tbd-space-4);
    border-top: var(--tbd-border-hairline) solid var(--tbd-rule);
    color: var(--tbd-text-muted);
  }

  body.is-open .gate-behind { opacity: 0; }
  body.is-open .gate-card { opacity: 0; transform: translateY(-8px); }

  @media (prefers-reduced-motion: reduce) {
    .gate-behind, .gate-card { transition: none; }
  }
</style>
</head>
<body data-tbd-surface="paper">
  <div class="gate-behind" aria-hidden="true"></div>

  <main class="gate-card">
    <p class="gate-mark"><span class="tbd-wordmark">tbd</span></p>
    <p class="tbd-eyebrow">Private preview</p>
    <h1 class="tbd-display gate-title">This part isn't public yet.</h1>
    <p class="tbd-body tbd-body--sm gate-copy">Enter the password to view the site. If you don't have one, the writing is open to everybody.</p>

    <form id="gateForm" autocomplete="off">
      <div class="gate-field">
        <input class="gate-input" id="gatePassword" type="password" name="password"
               placeholder="Password" aria-label="Password" autofocus required />
        <button class="tbd-btn gate-submit" type="submit">Enter</button>
      </div>
      <p class="tbd-label tbd-label--sm gate-msg" id="gateMsg" role="status" aria-live="polite"></p>
    </form>

    <p class="tbd-body tbd-body--sm gate-foot">No password? <a href="/blog/">Read Dispatches instead &rarr;</a></p>
  </main>

<script>
(function () {
  var form = document.getElementById("gateForm");
  var input = document.getElementById("gatePassword");
  var msg = document.getElementById("gateMsg");
  var button = form.querySelector("button");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    msg.textContent = "";

    fetch("/api/gate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: input.value }),
    })
      .then(function (res) {
        if (res.ok) {
          document.body.classList.add("is-open");
          setTimeout(function () { location.reload(); }, 620);
          return;
        }
        // Wrong password — send them where they are welcome.
        msg.textContent = "Not the password. Taking you to Dispatches\\u2026";
        setTimeout(function () { location.href = "/blog/"; }, 1400);
      })
      .catch(function () {
        button.disabled = false;
        msg.textContent = "Something went wrong. Try again.";
      });
  });
})();
</script>
</body>
</html>`;
}
