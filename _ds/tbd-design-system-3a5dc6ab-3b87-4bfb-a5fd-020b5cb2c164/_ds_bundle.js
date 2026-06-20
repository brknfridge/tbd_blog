/* @ds-bundle: {"format":3,"namespace":"TbdDesignSystem_3a5dc6","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Metric","sourcePath":"components/data/Metric.jsx"},{"name":"Pullquote","sourcePath":"components/data/Pullquote.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Eyebrow","sourcePath":"components/identity/Eyebrow.jsx"},{"name":"Wordmark","sourcePath":"components/identity/Wordmark.jsx"},{"name":"StatusDot","sourcePath":"components/labels/StatusDot.jsx"},{"name":"Tag","sourcePath":"components/labels/Tag.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"40b79474a8dc","components/data/Metric.jsx":"c7f52870d4d6","components/data/Pullquote.jsx":"1eb41a38e9bf","components/forms/Input.jsx":"d7f0d21d2cc6","components/identity/Eyebrow.jsx":"604f7f93586f","components/identity/Wordmark.jsx":"6299c9ff62fb","components/labels/StatusDot.jsx":"741c581f6c92","components/labels/Tag.jsx":"713cc90d1add","components/surfaces/Card.jsx":"1dbfbd3c992b","ui_kits/portal/portal.jsx":"74807e798cc3","ui_kits/website/site.jsx":"2ae312abd605"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TbdDesignSystem_3a5dc6 = window.TbdDesignSystem_3a5dc6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Button — the only loud control on a surface.
 * Primary is electric blue; ghost is a hairline outline. Mono, uppercase, tracked.
 */
function Button({
  children,
  variant = "primary",
  arrow = false,
  full = false,
  as = "button",
  className = "",
  ...props
}) {
  const Tag = as;
  const cls = ["tbd-btn", variant === "ghost" ? "tbd-btn--ghost" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: full ? {
      width: "100%"
    } : undefined
  }, props), /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/data/Metric.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Metric — a label-left / delta-right row. The delta carries the only
 * colour: emerald up, red down. Stack several inside a Card.
 */
function Metric({
  label,
  value,
  trend,
  className = "",
  ...props
}) {
  const valueCls = ["tbd-metric__value", trend === "up" ? "tbd-metric__value--up" : "", trend === "down" ? "tbd-metric__value--down" : ""].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tbd-metric", className].filter(Boolean).join(" ")
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "tbd-metric__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: valueCls
  }, value));
}
Object.assign(__ds_scope, { Metric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Metric.jsx", error: String((e && e.message) || e) }); }

// components/data/Pullquote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Pullquote — italic serif with a Deep Red rule on the left.
 * The one place red earns the spotlight.
 */
function Pullquote({
  children,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("blockquote", _extends({
    className: ["tbd-pullquote", className].filter(Boolean).join(" ")
  }, props), children);
}
Object.assign(__ds_scope, { Pullquote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Pullquote.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Input — a hairline text field, optionally with a mono uppercase label.
 * Focus draws the single blue accent. Transparent fill, like every surface.
 */
function Input({
  label,
  id,
  className = "",
  ...props
}) {
  const field = /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    className: ["tbd-input", className].filter(Boolean).join(" ")
  }, props));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    className: "tbd-field",
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-field__label"
  }, label), field);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/identity/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Eyebrow — a muted mono label with the brand square marker.
 * Sits above a heading or section as a kicker.
 */
function Eyebrow({
  children,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["tbd-eyebrow", className].filter(Boolean).join(" ")
  }, props), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/identity/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/identity/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Wordmark — the brackets are structural. Never drop, stretch or stylize.
 * Renders the bracketed [tbd] lockup. Minimum 14px on screen.
 */
function Wordmark({
  children = "tbd",
  variant = "primary",
  size,
  className = "",
  ...props
}) {
  const cls = ["tbd-wordmark", variant === "accent" ? "tbd-wordmark--accent" : "", variant === "bracketed" ? "tbd-wordmark--bracketed" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: size ? {
      fontSize: size
    } : undefined
  }, props), children);
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/identity/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/labels/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] StatusDot — a coloured dot + mono uppercase label.
 * Default (blue) = neutral/live, positive (emerald), critical (red).
 */
function StatusDot({
  children,
  tone = "default",
  className = "",
  ...props
}) {
  const cls = ["tbd-status", tone === "positive" ? "tbd-status--positive" : "", tone === "critical" ? "tbd-status--critical" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, props), children);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/labels/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Tag — a hairline pill label in mono uppercase. Metadata, categories.
 */
function Tag({
  children,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["tbd-tag", className].filter(Boolean).join(" ")
  }, props), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/Tag.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * [tbd] Card — a hairline-bordered container. Transparent fill; the border
 * does the work. Pass surface="paper" to flip to an ink-on-paper card.
 */
function Card({
  children,
  surface,
  className = "",
  style,
  ...props
}) {
  const cls = ["tbd-card", surface === "paper" ? "tbd-surface-paper" : "", className].filter(Boolean).join(" ");
  const merged = surface === "paper" ? {
    background: "var(--tbd-bg)",
    color: "var(--tbd-text)",
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    "data-tbd-surface": surface === "paper" ? "paper" : undefined,
    style: merged
  }, props), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/portal.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
const PDS = window.TbdDesignSystem_3a5dc6;
const {
  Button,
  Wordmark,
  Eyebrow,
  Tag,
  StatusDot,
  Metric,
  Pullquote,
  Card
} = PDS;

/* ---------- Sidebar ------------------------------------------------------ */
function Sidebar({
  active,
  setActive
}) {
  const nav = ["Overview", "Diagnostic", "Thesis", "Metrics", "Notes"];
  return /*#__PURE__*/React.createElement("aside", {
    className: "pt-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-side__brand"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    variant: "bracketed",
    size: 24
  })), /*#__PURE__*/React.createElement("nav", {
    className: "pt-side__nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    className: "pt-side__item tbd-label" + (active === n ? " is-active" : ""),
    onClick: () => setActive(n)
  }, n))), /*#__PURE__*/React.createElement("div", {
    className: "pt-side__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label--sm tbd-label tbd-text-muted"
  }, "Client"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-body tbd-body--sm"
  }, "Northwind"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-label--sm tbd-label tbd-text-muted",
    style: {
      marginTop: 12
    }
  }, "Lead"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-body tbd-body--sm"
  }, "H. Reyes")));
}

/* ---------- Topbar ------------------------------------------------------- */
function Topbar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "pt-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-top__title"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Sprint 03 \u2014 Diagnostic"), /*#__PURE__*/React.createElement("h1", {
    className: "tbd-display pt-top__h"
  }, "Week 04 of 06.")), /*#__PURE__*/React.createElement("div", {
    className: "pt-top__actions"
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: "positive"
  }, "On track"), /*#__PURE__*/React.createElement(Button, {
    arrow: true,
    style: {
      padding: "10px 18px"
    }
  }, "Open brief")));
}

/* ---------- Big stat cards ---------------------------------------------- */
function StatRow() {
  const stats = [{
    l: "North-star",
    v: "+ 18.4%",
    s: "Activation D30",
    t: "up"
  }, {
    l: "CAC payback",
    v: "− 22 days",
    s: "vs. baseline",
    t: "up"
  }, {
    l: "Pipeline",
    v: "$2.4M",
    s: "Qualified, sourced",
    t: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-stats"
  }, stats.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.l,
    className: "pt-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, s.l), /*#__PURE__*/React.createElement("span", {
    className: "tbd-display pt-stat__v" + (s.t === "up" ? " tbd-accent-emerald" : "")
  }, s.v), /*#__PURE__*/React.createElement("span", {
    className: "tbd-body tbd-body--sm tbd-text-muted"
  }, s.s))));
}

/* ---------- Timeline ----------------------------------------------------- */
function Timeline() {
  const weeks = [{
    w: "01",
    t: "Embed & read",
    done: true
  }, {
    w: "02",
    t: "Constraint named",
    done: true
  }, {
    w: "03",
    t: "Thesis written",
    done: true
  }, {
    w: "04",
    t: "Channel build",
    now: true
  }, {
    w: "05",
    t: "Lifecycle ship",
    done: false
  }, {
    w: "06",
    t: "Handover",
    done: false
  }];
  return /*#__PURE__*/React.createElement(Card, {
    className: "pt-timeline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, "Sprint timeline"), /*#__PURE__*/React.createElement("ol", {
    className: "pt-timeline__list"
  }, weeks.map(w => /*#__PURE__*/React.createElement("li", {
    key: w.w,
    className: "pt-timeline__row" + (w.now ? " is-now" : "") + (w.done ? " is-done" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label pt-timeline__w"
  }, w.w), /*#__PURE__*/React.createElement("span", {
    className: "pt-timeline__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tbd-body tbd-body--sm pt-timeline__t"
  }, w.t), w.now && /*#__PURE__*/React.createElement(StatusDot, null, "In progress"), w.done && /*#__PURE__*/React.createElement("span", {
    className: "tbd-label--sm tbd-label tbd-text-positive"
  }, "Done")))));
}

/* ---------- Metrics panel ----------------------------------------------- */
function MetricsPanel() {
  return /*#__PURE__*/React.createElement(Card, {
    className: "pt-metrics"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-metrics__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, "Weekly deltas"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-label--sm tbd-label tbd-text-muted"
  }, "vs. last week")), /*#__PURE__*/React.createElement(Metric, {
    label: "Activation",
    value: "+ 18.4%",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "CAC payback",
    value: "\u2212 22 days",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Retention D30",
    value: "\u2212 3.1%",
    trend: "down"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Expansion",
    value: "+ 11.0%",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Qualified pipeline",
    value: "+ 14 accts",
    trend: "up"
  }));
}

/* ---------- Thesis ------------------------------------------------------- */
function ThesisCard() {
  return /*#__PURE__*/React.createElement(Card, {
    className: "pt-thesis"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "The thesis"), /*#__PURE__*/React.createElement(Pullquote, {
    className: "pt-thesis__q"
  }, "Win on activation before channel. The funnel is full; the first session is the constraint."), /*#__PURE__*/React.createElement("div", {
    className: "pt-thesis__tags"
  }, /*#__PURE__*/React.createElement(Tag, null, "Activation-led"), /*#__PURE__*/React.createElement(Tag, null, "Positioning \u2192 Channel"), /*#__PURE__*/React.createElement(Tag, null, "Weekly cadence")));
}
Object.assign(window, {
  Sidebar,
  Topbar,
  StatRow,
  Timeline,
  MetricsPanel,
  ThesisCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/portal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/site.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
const DS = window.TbdDesignSystem_3a5dc6;
const {
  Button,
  Wordmark,
  Eyebrow,
  Tag,
  StatusDot,
  Metric,
  Pullquote,
  Card,
  Input
} = DS;

/* ---------- Nav ---------------------------------------------------------- */
function SiteNav({
  onBrief
}) {
  const links = ["Work", "Thesis", "Approach", "Team"];
  const [active, setActive] = useState("Work");
  return /*#__PURE__*/React.createElement("header", {
    className: "site-nav"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    variant: "bracketed",
    size: 26
  }), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#" + l.toLowerCase(),
    className: "site-nav__link tbd-label" + (active === l ? " is-active" : ""),
    onClick: () => setActive(l)
  }, l))), /*#__PURE__*/React.createElement(Button, {
    arrow: true,
    onClick: onBrief,
    style: {
      padding: "10px 18px"
    }
  }, "Open brief"));
}

/* ---------- Hero --------------------------------------------------------- */
function Hero({
  onBrief
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__head"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "A growth consultancy"), /*#__PURE__*/React.createElement(StatusDot, {
    tone: "positive"
  }, "Booking Q3 sprints")), /*#__PURE__*/React.createElement("h1", {
    className: "tbd-display tbd-display--lg hero__headline"
  }, "A growth firm for companies whose next chapter is", " ", /*#__PURE__*/React.createElement("span", {
    className: "tbd-accent-blue"
  }, "to be defined.")), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-body--lg hero__lede"
  }, "We embed with operating teams to run sharp diagnostics, set a deliberate growth thesis, and ship the work \u2014 not the slideware. Diagnose, decide, deploy, in six weeks."), /*#__PURE__*/React.createElement("div", {
    className: "hero__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    arrow: true,
    onClick: onBrief
  }, "Open brief"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Read the thesis")));
}

/* ---------- Client strip ------------------------------------------------- */
function ClientStrip() {
  const names = ["NORTHWIND", "AXIOM", "FIELDNOTE", "LUMEN", "BASIS", "MERIDIAN"];
  return /*#__PURE__*/React.createElement("section", {
    className: "strip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted strip__cap"
  }, "Embedded with"), /*#__PURE__*/React.createElement("div", {
    className: "strip__names"
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "tbd-label strip__name"
  }, n))));
}

/* ---------- Approach ----------------------------------------------------- */
function Approach() {
  const steps = [{
    n: "01",
    t: "Diagnose",
    d: "Two weeks embedded. We read the data, the funnel and the team — and name the constraint that actually moves revenue."
  }, {
    n: "02",
    t: "Decide",
    d: "A single growth thesis, written down. The deliberate bets, the order of operations, the metric we hold ourselves to."
  }, {
    n: "03",
    t: "Deploy",
    d: "We ship the work alongside your team — positioning, channel, lifecycle — and measure it weekly until it compounds."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "approach"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "02 \u2014 Approach"), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-text-muted section__intro"
  }, "One six-week sprint. Three movements. No slideware that outlives the meeting.")), /*#__PURE__*/React.createElement("div", {
    className: "approach__grid"
  }, steps.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    className: "approach__card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-display tbd-display--sm approach__num"
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    className: "tbd-subhead tbd-subhead--sm"
  }, s.t), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-body--sm tbd-text-muted"
  }, s.d)))));
}

/* ---------- Proof -------------------------------------------------------- */
function Proof() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section proof",
    id: "thesis"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "03 \u2014 Proof"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, "Sprint 03 \xB7 Northwind \xB7 Week 06 of 06")), /*#__PURE__*/React.createElement("div", {
    className: "proof__grid"
  }, /*#__PURE__*/React.createElement(Pullquote, {
    className: "proof__quote"
  }, "We turn ambiguity into a plan, and a plan into compounding revenue."), /*#__PURE__*/React.createElement(Card, {
    className: "proof__metrics"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Activation",
    value: "+ 18.4%",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "CAC payback",
    value: "\u2212 22 days",
    trend: "up"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Retention D30",
    value: "\u2212 3.1%",
    trend: "down"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Expansion",
    value: "+ 11.0%",
    trend: "up"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "proof__tags"
  }, /*#__PURE__*/React.createElement(Tag, null, "Series B\u2013D"), /*#__PURE__*/React.createElement(Tag, null, "Embedded"), /*#__PURE__*/React.createElement(Tag, null, "Six-week sprint"), /*#__PURE__*/React.createElement(Tag, null, "Positioning \u2192 Channel")));
}

/* ---------- CTA ---------------------------------------------------------- */
function CTA({
  onBrief
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cta",
    id: "team"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "tbd-display cta__headline"
  }, "Your next chapter is ", /*#__PURE__*/React.createElement("span", {
    className: "tbd-accent-blue"
  }, "to be defined.")), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-body--lg cta__lede"
  }, "Six weeks. One thesis. Work that ships."), /*#__PURE__*/React.createElement(Button, {
    arrow: true,
    onClick: onBrief
  }, "Open brief"));
}

/* ---------- Footer ------------------------------------------------------- */
function SiteFooter() {
  const cols = [{
    h: "Firm",
    items: ["Thesis", "Approach", "Team", "Notes"]
  }, {
    h: "Work",
    items: ["Diagnostics", "Positioning", "Lifecycle", "Channel"]
  }, {
    h: "Contact",
    items: ["hello@tbd.co", "Open brief", "LinkedIn"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-foot__top"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    variant: "bracketed",
    size: 64
  }), /*#__PURE__*/React.createElement("div", {
    className: "site-foot__cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h,
    className: "site-foot__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, c.h), c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    className: "tbd-body tbd-body--sm site-foot__link"
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    className: "site-foot__base"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, "\xA9 2026 [tbd] \u2014 a growth consultancy"), /*#__PURE__*/React.createElement("span", {
    className: "tbd-label tbd-text-muted"
  }, "Vol. 01 / 2026 Edition")));
}

/* ---------- Brief modal -------------------------------------------------- */
function BriefModal({
  open,
  onClose
}) {
  const [sent, setSent] = useState(false);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__panel tbd-surface-paper",
    "data-tbd-surface": "paper",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal__close tbd-label",
    onClick: onClose,
    "aria-label": "Close"
  }, "\u2715"), !sent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Eyebrow, null, "Open a brief"), /*#__PURE__*/React.createElement("h3", {
    className: "tbd-display tbd-display--sm modal__title"
  }, "Tell us the constraint."), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-body--sm tbd-text-muted modal__sub"
  }, "Two lines on where growth has stalled. We reply within a working day."), /*#__PURE__*/React.createElement("div", {
    className: "modal__fields"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Helena Reyes",
    defaultValue: ""
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    placeholder: "you@company.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Company stage",
    placeholder: "Series B\u2013D"
  })), /*#__PURE__*/React.createElement(Button, {
    full: true,
    arrow: true,
    onClick: () => setSent(true)
  }, "Send brief")) : /*#__PURE__*/React.createElement("div", {
    className: "modal__done"
  }, /*#__PURE__*/React.createElement(StatusDot, {
    tone: "positive"
  }, "Received"), /*#__PURE__*/React.createElement("h3", {
    className: "tbd-display tbd-display--sm modal__title"
  }, "The brief is in."), /*#__PURE__*/React.createElement("p", {
    className: "tbd-body tbd-body--sm tbd-text-muted"
  }, "We'll read it and reply within a working day. The brackets stay; the question marks do not."), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Close"))));
}
Object.assign(window, {
  SiteNav,
  Hero,
  ClientStrip,
  Approach,
  Proof,
  CTA,
  SiteFooter,
  BriefModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.Pullquote = __ds_scope.Pullquote;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Card = __ds_scope.Card;

})();
