# spendle.

*You think you know what things cost?* — a daily Indian price-guessing game at
**tbdonline.in/spendle**. Five products, 20 seconds each, scored on proportional
accuracy out of 5,000, with a spoiler-free emoji share card.

React + TypeScript + Vite, styled on the [tbd] design system (linked from the main
site's `/_ds/`, never bundled). No backend; progress lives in LocalStorage.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/spendle/  (serves ../_ds for the design system)
npm test           # vitest — scoring, formatting, selection, timer, streaks, commentary, share, data
npm run build      # → dist/
```

## Deploy

Nothing extra to do: the site's root `npm run build` runs `build:spendle`
(`npm ci` + `vite build` here) and Eleventy copies `spendle-app/dist` to
`_site/spendle/`. Pushing to `main` deploys via Vercel. `/spendle` is exempt from
the password gate in `middleware.js`, like `/wordle` and `/matchle`.

**Before launch:** set `LAUNCH_DATE` in `src/config.ts` to the IST date of
Spendle #001 (currently `2026-11-22`).

## Product data — `src/data/products.ts`

Every active record carries `priceINR`, `priceType`, `priceSource` (the page the
price was seen on) and `verifiedAt`. Unverified records are `active: false` with
the reason in `notes`; the selector never uses them. `products.test.ts` enforces
this and proves a valid daily quiz exists for every day of the next year.

As of 2026-11-22: **41 active, 9 inactive.**

| Inactive | Why |
|---|---|
| Kissan Mixed Fruit Jam 500 g | Retailers disagree (₹199–210) |
| Gucci GG Marmont Small | No official/authorised INR price found |
| Rolex Datejust 36 (126234) | Only conflicting search snippets (₹9.40 L vs ₹9.86 L) |
| Hermès Oran | No official INR price online |
| Prada Re-Edition 2005 | No India e-commerce / authorised INR price |
| Montblanc Meisterstück Classique | Retailer price only, changed between snapshots |
| iPhone 17 Pro 256 GB | Discontinued on apple.com/in (iPhone 18 Pro now sold) |
| Porsche Macan | Sources disagree (₹89.65 L vs ₹91.09 L) |
| Powai 2 BHK (L&T Elixir Reserve) | Only an undated "from ₹3.61 Cr" portal price |

Substitutions where the requested pack/variant no longer exists (the record names
what was verified): Nescafé Classic 90 g, Lay's 58 g, Tropicana Orange Delight,
Good Day 248 g, Dairy Milk Silk 144 g, Cetaphil 118 ml, MAC MACximal 3.5 g,
Dyson Airwrap i.d., Creta King IVT (SX(O) discontinued), Seltos GTX (no GTX+ on
new gen). Lower-certainty actives worth a manual re-check are flagged in `notes`
(Amul from a news report, Kellogg's/Dior/Sony from search snippets, cars from
CarDekho/CarWale/Autocar where the official site wouldn't load, Worli flat from
Housiey's price sheet rather than Lodha directly).

To add or fix a product: edit the record, set `active: true` only once you've
seen the price on the cited page, update `verifiedAt`, run `npm test`.

## Images

Every active product has a local WebP in `public/products/<id>.webp` (41 files,
~1.3 MB total, ≤ 900 px, white margins trimmed). `products.test.ts` fails if an
active product's image is missing. If an image fails or takes over 6 s, the card
falls back to a typographic plate and the round still starts. Photos sit on a
Pure White mount in both themes, per the design system.

Sources (fetched 2026-11-22). These are brand and retailer marketing images, used
editorially. Swap any of them for licensed shots if a brand objects:

- **Blinkit product listings:** Maggi, Nutella, Tata Salt, Nescafé, Coca-Cola, Lay's,
  Red Bull, Pringles, Tropicana, Good Day, Dairy Milk Silk
- **Amazon.in listings:** Kellogg's, Ferrero Rocher, Dove, L'Oréal, Cetaphil, Sony
- **Flipkart:** Amul
- **Official brand sites:** Maybelline, Nivea, Minimalist, Kiehl's, Dyson,
  Louis Vuitton, Tissot, Ray-Ban, Coach (coach.in)
- **Sephora India:** The Ordinary, MAC
- **Kapoor Watch (authorised retailer):** Omega, Longines
- **1stdibs listing:** Cartier LOVE B6067517
- **Fashionphile listing:** Dior Saddle, blue Oblique
- **CarDekho / CarWale / Autocar India:** all cars
- **HomeBazaar:** Lodha Adrina

Two edits were made to images. The Dove listing photo shows a 190 ml bottle, so
the "190 ml" print was painted out to stop it contradicting the 250 ml record.
The Tissot record was corrected to *black* dial: the official T137.407.11.051.00
image shows black, not blue as first noted.

## Fairness, honestly

Answers ship in the client bundle and LocalStorage can be edited, so this is not
cheat-proof and there is deliberately no leaderboard. Presentation, answer lookup
(`lib/catalog.ts`) and scoring (`lib/game.ts`) are separated so the answer
lookup can move server-side later. Daily quizzes are seeded by IST date and are
identical on every device running the same deploy.
