/* ==========================================================================
   [tbd] — site motion layer
   Custom cursor · magnetic buttons · scroll reveal · word reveal ·
   count-up · page-wipe transitions · mobile nav · floating labels
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Custom cursor ---------------------------------------------- */
  function initCursor() {
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx = -100, my = -100, rx = mx, ry = my, shown = false;
    dot.style.opacity = "0"; ring.style.opacity = "0";
    addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    var hoverSel = "a, button, .magnetic, .svc-card, [data-cursor='hover']";
    var textSel = "input, textarea";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(textSel)) { ring.classList.add("is-text"); dot.classList.add("is-text"); ring.classList.remove("is-hover"); }
      else if (e.target.closest(hoverSel)) { ring.classList.add("is-hover"); }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(textSel)) { ring.classList.remove("is-text"); dot.classList.remove("is-text"); }
      if (e.target.closest(hoverSel) && !e.relatedTarget) { ring.classList.remove("is-hover"); }
      else if (e.target.closest(hoverSel) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverSel))) { ring.classList.remove("is-hover"); }
    });
    document.addEventListener("mousedown", function () { ring.style.scale = "0.82"; });
    document.addEventListener("mouseup", function () { ring.style.scale = "1"; });
  }

  /* ---------- Magnetic buttons ------------------------------------------- */
  function initMagnetic() {
    if (!fine || reduce) return;
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-mag")) || 0.3;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + x * strength + "px," + y * strength + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform 320ms cubic-bezier(.22,1,.36,1)";
        el.style.transform = "translate(0,0)";
        setTimeout(function () { el.style.transition = ""; }, 340);
      });
      el.addEventListener("mouseenter", function () { el.style.transition = ""; });
    });
  }

  /* ---------- Word-by-word reveal: split [data-words] -------------------- */
  function splitWords() {
    document.querySelectorAll("[data-words]").forEach(function (el) {
      el.classList.add("reveal-words");
      var tmp = document.createElement("div");
      tmp.innerHTML = el.innerHTML;
      var out = "";
      function emit(text, cls) {
        text.split(/(\s+)/).forEach(function (tok) {
          if (tok.trim() === "") { out += " "; }
          else { out += '<span class="word' + (cls ? " " + cls : "") + '">' + tok + "</span>"; }
        });
      }
      tmp.childNodes.forEach(function (node) {
        if (node.nodeType === 3) { emit(node.textContent, ""); }
        else if (node.nodeType === 1) { emit(node.textContent, node.getAttribute("class") || ""); }
      });
      el.innerHTML = out;
      var i = 0;
      el.querySelectorAll(".word").forEach(function (s) { s.style.transitionDelay = (i * 0.04) + "s"; i++; });
    });
  }

  /* ---------- Scroll reveal (position-based; robust everywhere) ---------- */
  function reveal(el) {
    if (el.classList.contains("is-in")) return;
    el.classList.add("is-in");
    if (el.hasAttribute("data-count")) countUp(el);
    el.querySelectorAll("[data-count]").forEach(countUp);
  }
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-words, [data-count]"));
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var remaining = false;
      els.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) reveal(el);
        else remaining = true;
      });
      return remaining;
    }
    check();
    var onScroll = function () { if (!check()) cleanup(); };
    function cleanup() { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Safety: if anything is still hidden after a beat, reveal it.
    setTimeout(function () { els.forEach(reveal); cleanup(); }, 2600);
  }

  /* ---------- Count-up --------------------------------------------------- */
  function countUp(el) {
    if (el.dataset.counted) return; el.dataset.counted = "1";
    var raw = el.getAttribute("data-count");           // e.g. "3.8", "184", "62", "6"
    var pre = el.getAttribute("data-pre") || "";
    var suf = el.getAttribute("data-suf") || "";
    var dec = (raw.indexOf(".") > -1) ? raw.split(".")[1].length : 0;
    var target = parseFloat(raw);
    if (reduce) { el.textContent = pre + raw + suf; return; }
    var dur = 1100, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var v = (target * e).toFixed(dec);
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = pre + raw + suf;
    }
    requestAnimationFrame(step);
    // Fallback: guarantee the final value even if rAF is throttled/frozen.
    setTimeout(function () { el.textContent = pre + raw + suf; }, dur + 300);
  }

  /* ---------- Floating labels -------------------------------------------- */
  function initFloatingLabels() {
    document.querySelectorAll(".flabel input, .flabel textarea").forEach(function (f) {
      var sync = function () { f.classList.toggle("has-val", f.value.trim() !== ""); };
      f.addEventListener("input", sync); sync();
    });
  }

  /* ---------- Mobile nav ------------------------------------------------- */
  function initMobileNav() {
    var burger = document.querySelector(".nav-burger");
    var overlay = document.querySelector(".nav-overlay");
    if (!burger || !overlay) return;
    var close = overlay.querySelector(".nav-overlay__close");
    burger.addEventListener("click", function () { overlay.classList.add("is-open"); document.body.style.overflow = "hidden"; });
    function shut() { overlay.classList.remove("is-open"); document.body.style.overflow = ""; }
    if (close) close.addEventListener("click", shut);
  }

  /* ---------- Page-wipe transitions -------------------------------------- */
  function initWipe() {
    var wipe = document.querySelector(".page-wipe");
    if (!wipe) return;
    var label = wipe.querySelector(".page-wipe__label");
    var ease = "cubic-bezier(.76,0,.24,1)";

    // Wipe-out on arrival (if we came via an intercepted link)
    var incoming = sessionStorage.getItem("tbdWipe");
    if (incoming !== null && !reduce) {
      if (label) label.textContent = incoming || "[tbd]";
      wipe.style.transition = "none";
      wipe.style.transform = "translateY(0)";
      if (label) label.style.opacity = "1";
      void wipe.offsetWidth;
      requestAnimationFrame(function () {
        wipe.style.transition = "transform 560ms " + ease;
        wipe.style.transform = "translateY(-100%)";
        if (label) { label.style.transition = "opacity 180ms ease"; label.style.opacity = "0"; }
      });
      setTimeout(function () {
        wipe.style.transition = "none";
        wipe.style.transform = "translateY(100%)";
      }, 640);
    }
    sessionStorage.removeItem("tbdWipe");

    if (reduce) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (/^https?:\/\//.test(href) && href.indexOf(location.origin) !== 0) return;
      if (href.charAt(0) !== "/") return;
      if (href.split("#")[0] === location.pathname) return;
      // Internal page navigation
      e.preventDefault();
      var name = (a.getAttribute("data-wipe") || a.textContent || "[tbd]").trim().toUpperCase();
      sessionStorage.setItem("tbdWipe", name);
      if (label) { label.textContent = name; }
      wipe.style.transition = "transform 500ms " + ease;
      wipe.style.transform = "translateY(0)";
      if (label) { label.style.transition = "opacity 200ms ease 140ms"; label.style.opacity = "1"; }
      setTimeout(function () { location.href = href; }, 520);
    });
  }

  /* ---------- Active nav link -------------------------------------------- */
  function markActiveNav() {
    var here = location.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
    document.querySelectorAll(".site-nav__link, .nav-overlay__links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0];
      if (href.charAt(0) !== "/") return;
      if (href.replace(/\/?$/, "/") === here) a.classList.add("is-active");
    });
  }

  /* ---------- Enable entrance animation only if transitions truly run ----
     transitionend fires only when a real transition completes. In frozen
     capture / no-JS environments it never fires, so content stays visible
     (the default) and nothing is ever hidden. */
  function enableAnimIfSupported(done) {
    if (reduce) { done(); return; }
    var d = document.createElement("div");
    d.style.cssText = "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0.001;transition:opacity 70ms linear;";
    document.body.appendChild(d);
    var fin = false;
    function finish(ok) {
      if (fin) return; fin = true;
      if (d.parentNode) d.parentNode.removeChild(d);
      if (ok) document.documentElement.classList.add("anim-on");
      done();
    }
    d.addEventListener("transitionend", function () { finish(true); });
    void d.offsetWidth;
    d.style.opacity = "1";
    setTimeout(function () { finish(false); }, 360);
  }

  /* ---------- Boot ------------------------------------------------------- */
  function boot() {
    splitWords();
    initCursor();
    initMagnetic();
    initFloatingLabels();
    initMobileNav();
    initWipe();
    markActiveNav();
    // Decide on animation first, THEN run reveals so the entrance plays.
    enableAnimIfSupported(function () { initReveal(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
