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
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    font-family: var(--tbd-font-sans, ui-sans-serif, system-ui, sans-serif);
    color: var(--tbd-color-ink, #16161a);
    background: var(--tbd-color-paper, #f4f2ee);
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  /* Blurred stand-in for the page behind the gate. Decorative only — it holds
     no real copy, which is the point. */
  .gate-behind {
    position: fixed;
    inset: -12vmin;
    filter: blur(64px);
    opacity: 0.85;
    transition: filter 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease;
    pointer-events: none;
  }
  .gate-behind i {
    position: absolute;
    display: block;
    border-radius: 50%;
  }
  .gate-behind i:nth-child(1) {
    width: 46vmax; height: 46vmax; top: -8vmax; left: -6vmax;
    background: var(--tbd-color-blue, #2f4cff); opacity: 0.28;
  }
  .gate-behind i:nth-child(2) {
    width: 34vmax; height: 34vmax; bottom: -10vmax; right: -4vmax;
    background: var(--tbd-color-ink, #16161a); opacity: 0.18;
  }
  .gate-behind i:nth-child(3) {
    width: 26vmax; height: 26vmax; top: 34%; left: 44%;
    background: var(--tbd-color-emerald, #1f7a5a); opacity: 0.16;
  }

  .gate-card {
    position: relative;
    width: min(440px, calc(100vw - 40px));
    padding: 40px;
    background: var(--tbd-color-pure, #fff);
    border: 1px solid var(--tbd-rule, rgba(0,0,0,0.12));
    border-radius: var(--tbd-radius-md, 4px);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.14);
    transition: opacity 420ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gate-mark {
    font-family: var(--tbd-font-display, Georgia, serif);
    font-size: 24px;
    line-height: 1;
    margin: 0 0 28px;
  }
  .gate-label {
    font-family: var(--tbd-font-mono, ui-monospace, monospace);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--tbd-color-muted, #6b6b70);
    margin: 0 0 10px;
  }
  .gate-title {
    font-family: var(--tbd-font-display, Georgia, serif);
    font-size: 30px;
    line-height: 1.15;
    font-weight: 400;
    margin: 0 0 10px;
  }
  .gate-copy {
    font-size: 14px;
    line-height: 1.55;
    color: var(--tbd-color-muted, #6b6b70);
    margin: 0 0 24px;
  }

  .gate-field { display: flex; gap: 8px; }
  .gate-input {
    flex: 1;
    min-width: 0;
    font-family: inherit;
    font-size: 15px;
    padding: 12px 14px;
    color: inherit;
    background: var(--tbd-color-paper, #f4f2ee);
    border: 1px solid var(--tbd-rule, rgba(0,0,0,0.12));
    border-radius: var(--tbd-radius-sm, 3px);
  }
  .gate-input:focus {
    outline: 2px solid var(--tbd-color-blue, #2f4cff);
    outline-offset: 1px;
  }
  .gate-submit {
    font-family: var(--tbd-font-mono, ui-monospace, monospace);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 12px 20px;
    color: var(--tbd-color-paper, #fff);
    background: var(--tbd-color-blue, #2f4cff);
    border: 0;
    border-radius: var(--tbd-radius-sm, 3px);
    cursor: pointer;
  }
  .gate-submit[disabled] { opacity: 0.55; cursor: default; }

  .gate-msg {
    min-height: 18px;
    margin: 12px 0 0;
    font-family: var(--tbd-font-mono, ui-monospace, monospace);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--tbd-color-red, #c0392b);
  }

  .gate-foot {
    margin: 24px 0 0;
    padding-top: 20px;
    border-top: 1px solid var(--tbd-rule, rgba(0,0,0,0.12));
    font-size: 13px;
    color: var(--tbd-color-muted, #6b6b70);
  }
  .gate-foot a { color: var(--tbd-color-blue, #2f4cff); }

  body.is-open .gate-behind { filter: blur(0); opacity: 0; }
  body.is-open .gate-card { opacity: 0; transform: translateY(-8px); }

  @media (prefers-reduced-motion: reduce) {
    .gate-behind, .gate-card { transition: none; }
  }
</style>
</head>
<body>
  <div class="gate-behind" aria-hidden="true"><i></i><i></i><i></i></div>

  <main class="gate-card">
    <p class="gate-mark">[tbd]</p>
    <p class="gate-label">Private preview</p>
    <h1 class="gate-title">This part isn't public yet.</h1>
    <p class="gate-copy">Enter the password to view the site. If you don't have one, the writing is open to everybody.</p>

    <form id="gateForm" autocomplete="off">
      <div class="gate-field">
        <input class="gate-input" id="gatePassword" type="password" name="password"
               placeholder="Password" aria-label="Password" autofocus required />
        <button class="gate-submit" type="submit">Enter</button>
      </div>
      <p class="gate-msg" id="gateMsg" role="status" aria-live="polite"></p>
    </form>

    <p class="gate-foot">No password? <a href="/blog/">Read Dispatches instead &rarr;</a></p>
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
