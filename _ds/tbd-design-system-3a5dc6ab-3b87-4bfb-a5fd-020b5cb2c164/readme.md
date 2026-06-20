# [tbd] — Design System

**Identity System Vol. 01 · 2026 Edition**

The design system for **[tbd]**, a growth consultancy. *TBD Online* brings the best
of consulting and marketing together to offer execution excellence — a growth firm
for companies whose next chapter is *to be defined.* The brackets are structural:
they hold the name in place while the work is being defined.

This project turns the brand into a usable system — design tokens, self-hosted
webfonts, foundation specimen cards, React component primitives, and full-screen
UI kits — that design agents can build against.

---

## Sources

This system was built from the company's own design-system repository. The reader
is encouraged to explore it further to build higher-fidelity work:

- **GitHub — `TBDOnline/design_system`** (private): https://github.com/TBDOnline/design_system
  - `css/tokens.css`, `css/tbd.css` — the canonical token + component CSS (the
    source of truth ported into this project).
  - `tokens/tokens.json` — W3C design-tokens source.
  - `tailwind/preset.js` — the Tailwind preset mirror.
  - `index.html` — the original live showcase of the whole system.

No Figma file, slide template, or product codebase was supplied. The two UI kits
here (marketing site + client portal) are faithful extrapolations of the brand's
own showcase patterns — not invented directions.

---

## Content fundamentals

> Three adjectives — we write the way the work behaves: **Precise. Confident. In motion.**

- **Voice is declarative, never tentative.** Make the call, use the period. Short
  sentences. *"Strategy set in motion." · "Diagnose, decide, deploy — in six weeks."*
- **Precise over vague.** Name the metric, quote the figure. *"+ 18.4% activation",
  "− 22 days CAC payback", "Week 04 of 06"* — never "significant improvement".
- **Active and forward-leaning.** "We embed", "we ship the work — not the slideware".
  Verbs lead. Avoid hedges ("might", "could help", "we believe").
- **First person plural ("we"), second person for the client ("you", "your team").**
  Warm but exact, e.g. *"Dear Helena — we have read the brief and listened to the team."*
- **The bracket conceit runs through the copy.** "The brackets stay; the question
  marks do not." "Your next chapter is to be defined." Lean on it sparingly, never
  as a pun.
- **Casing:** sentence case for display and body. UPPERCASE only for mono labels,
  eyebrows, buttons, tags and status — and they are tracked out (+16%).
- **No emoji. Ever.** No exclamation marks in product or marketing copy. Numbers are
  written with a thin space around signs and units ("+ 18.4%", "− 22 days").
- **Eyebrows are numbered section kickers:** "01 — Positioning", "02 — Approach".

---

## Visual foundations

**Overall vibe.** Editorial, near-monochrome, confident. An ink-black canvas, an
off-white "paper", and exactly one accent at a time. It reads like a well-set
financial broadsheet crossed with a terminal — serious, precise, in motion.

### Color
- **Two foundation colors carry everything:** Ink Black `#0A0A0A` (the default
  background) and Paper `#F5F3EE` (off-white, *never* pure white) for light surfaces
  and for text on dark. Pure White `#FFFFFF` is reserved for print/photography.
- **Three accents, used as highlights, never together:** Electric Blue `#1F4BFF`
  (links, key data, focus, the one loud control) capped at ≤ 8% of a surface; Deep
  Red `#C8201F` (pull-quotes, critical states) ≤ 5%; Emerald `#0E7C5A` (positive
  deltas, growth) ≤ 5%. **One accent per view.** Color earns its place; it never
  decorates.
- Default surface is **dark**. Flip to a paper surface with `data-tbd-surface="paper"`
  or `.tbd-surface-paper`; semantic tokens (`--tbd-bg`, `--tbd-text`, rule colors)
  invert automatically.

### Typography — two voices
- **Display:** *Instrument Serif Italic* — for statements that matter. 132 / 96 / 64,
  tracking −2.5%, leading 0.95. Always italic.
- **Subhead / UI titles:** Geist Medium. 56 / 40 / 28, tracking −2%.
- **Body:** Geist Regular. 22 / 18 / 16, leading 1.55.
- **Label / UI:** Geist Mono Medium, UPPERCASE, tracking +16%. 14 / 12. Used for
  eyebrows, buttons, tags, status, metrics, metadata.
- The serif/sans tension *is* the brand: an italic-serif headline with one
  blue-accented phrase, set against geometric-sans body and mono labels.

### Spacing, radius, borders
- **4px base scale** (`--tbd-space-1` 4 → `--tbd-space-32` 128).
- **Restrained radius:** sm 4 · md 8 · lg 16 · pill 999. Most surfaces use md (8).
- **Hairline (1px) and thick (2px) borders only.** The 2px is the accent rule.

### Surfaces, cards & shadows
- **Cards are hairline-bordered, transparent-fill containers.** *No drop shadows* —
  the border does the work. The only "elevation" is the modal scrim
  (`rgba(10,10,10,0.72)` + a subtle blur).
- Backgrounds are **flat color** — no gradients, no photographic textures, no
  hand-drawn illustration, no repeating patterns. The system is deliberately spare.

### Motion
- **Fast and functional, never bouncy.** Transitions are 120ms ease on `filter`,
  `background`, `border-color`. No spring/overshoot, no decorative loops.
- Hover: primary button brightens (`brightness(1.1)`); ghost button's border goes
  from rule → text color; links underline; muted text/nav items go to full text color.
- Press/active: primary button darkens slightly (`brightness(0.95)`). No scale/shrink.
- Focus: a 2px electric-blue outline at +2px offset (inputs use a blue border + 1px
  ring). Respect `prefers-reduced-motion` for any entrance animation you add.

### Transparency & blur
- Used sparingly and only for chrome: the sticky nav uses an 88% ink fill +
  `backdrop-filter: blur(10px)`; the modal scrim uses a 4px blur. Content surfaces
  stay opaque.

### Imagery
- The brand ships **no photography or illustration**. If imagery is ever introduced,
  it should be Pure White-mounted, high-contrast and editorial; assume cool/neutral,
  never warm or heavily filtered. Default to **type and rules** instead of images.

---

## Iconography

[tbd] does **not** use an icon library, an icon font, or an SVG icon set — none
exists in the source repo, and the spare aesthetic is intentional. "Iconography" is
a small, typographic vocabulary:

- **The brackets `[ ]`** — the structural wordmark device, drawn via CSS `::before` /
  `::after` on `.tbd-wordmark`. Never typed inline, never broken apart, never restyled.
- **The 7px square marker** — the `.tbd-eyebrow::before` block that prefixes every
  eyebrow/kicker.
- **The status dot** — an 8px round dot (blue / emerald / red) that pairs with a mono
  label for state.
- **The arrow glyph `→`** (U+2192) — the only directional icon, used as a trailing
  affordance on primary buttons ("Open brief →").
- **No emoji, no Unicode pictographs.** A bare `✕` (U+2715) is acceptable as a modal
  close affordance.

**If a future surface genuinely needs line icons,** substitute **Lucide**
(https://lucide.dev) at a 1.5px stroke to match the hairline borders, keep them
monochrome (currentColor), and flag the addition — it is a deviation from the
current system, which is icon-free by design.

### Assets in this project
- `assets/fonts/` — the three self-hosted webfonts (Instrument Serif roman + italic,
  Geist variable, Geist Mono variable), declared in `tokens/fonts.css`.
- There are **no logo image files**: the wordmark is pure type + CSS. Render it with
  the `Wordmark` component or `.tbd-wordmark` class rather than an `<img>`.

---

## Index / manifest

**Global entry**
- `styles.css` — the one file consumers link. `@import`s the token + base layers below.

**Tokens** (`tokens/`)
- `fonts.css` — `@font-face` for the three families (self-hosted woff2).
- `colors.css` — foundation, accent, grey & semantic color tokens (+ paper-surface scope).
- `typography.css` — families, weights, sizes, leading, tracking.
- `spacing.css` — 4px spacing scale, radius, borders, logo min size.
- `base.css` — reset, the four typographic roles, wordmark, utilities, and the CSS
  twins of every component (`.tbd-btn`, `.tbd-card`, `.tbd-metric`, …).

**Foundation cards** (`guidelines/cards/`) — render in the Design System tab:
Colors (foundation, accents, text-on-ink, paper surface), Type (display, subhead,
body, label), Spacing (scale, radius & borders), Brand (wordmark, voice & tone).

**Components** (`components/`) — React primitives, each with `.jsx`, `.d.ts`,
`.prompt.md` and a directory card:
- `buttons/` → **Button** · `identity/` → **Wordmark**, **Eyebrow** ·
  `labels/` → **Tag**, **StatusDot** · `surfaces/` → **Card** ·
  `data/` → **Metric**, **Pullquote** · `forms/` → **Input**.

**UI kits** (`ui_kits/`)
- `website/` — the [tbd] marketing homepage (hero, approach, proof, CTA, brief modal).
- `portal/` — the embedded client sprint dashboard (sidebar, timeline, deltas, thesis).

**Other**
- `SKILL.md` — makes this system usable as a downloadable Agent Skill.
- `assets/fonts/` — self-hosted webfonts.

---

## Quick start

```html
<link rel="stylesheet" href="styles.css" />

<h1 class="tbd-display tbd-display--lg">
  Strategy set <span class="tbd-accent-blue">in motion.</span>
</h1>
<p class="tbd-body">Diagnose, decide, deploy — in six weeks.</p>
<button class="tbd-btn">Open brief →</button>
```

In React (components are bundled to `window.<Namespace>` by the compiler):

```jsx
const { Button, Wordmark, Metric } = window.TbdDesignSystem; // see check_design_system for exact namespace
<Button arrow>Open brief</Button>
```

---

*Color earns its place; it never decorates. The brackets stay; the question marks do not.*
