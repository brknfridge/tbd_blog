// Meta Pixel events for [tbd]. Loaded right after the base pixel snippet.
// - Lead:            window.tbdLead(source) — called when a form submit succeeds;
//                    `source` is sent as the lead_source attribute
// - TimeOnSite10s:   10 seconds after page load (once per page view)
// - ScrollDepth50:   first time the reader passes 50% of the page (once per page view)
// - ButtonClick:     every button / button-styled link press, with its label
(function () {
  function fb() { return typeof window.fbq === "function" ? window.fbq : null; }
  function custom(name, params) { var f = fb(); if (f) f("trackCustom", name, params || {}); }

  window.tbdLead = function (source) {
    var f = fb();
    if (f) f("track", "Lead", { lead_source: source || "unknown", page: location.pathname });
  };

  setTimeout(function () { custom("TimeOnSite10s", { page: location.pathname }); }, 10000);

  var scrollDone = false;
  function onScroll() {
    if (scrollDone) return;
    var d = document.documentElement;
    var total = Math.max(d.scrollHeight, document.body.scrollHeight);
    if ((window.pageYOffset + window.innerHeight) / total >= 0.5) {
      scrollDone = true;
      window.removeEventListener("scroll", onScroll);
      custom("ScrollDepth50", { page: location.pathname });
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  var BTN = 'button, [role="button"], input[type="button"], input[type="submit"], a[class*="btn"], a[class*="button"], a[class*="cta"]';
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest(BTN);
    if (!el) return;
    var label = (el.getAttribute("aria-label") || el.innerText || el.value || el.id || "").replace(/\s+/g, " ").trim().slice(0, 80);
    custom("ButtonClick", { label: label || "(unlabelled)", page: location.pathname, href: el.getAttribute("href") || undefined });
  }, true);
})();
