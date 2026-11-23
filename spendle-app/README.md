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

## Product data — `src/data/`

Products live in **pools**, and `POOLS` in `src/config.ts` maps each pool to the IST date it takes
over the daily challenge. A daily always draws from the pool live on its own date, so a mid-day
deploy never changes that day's five products. Endless mode uses the newest pool as soon as it ships.
Retired pools stay in the database so old results and streak history still render.

| Pool | File | Products | Daily from |
|---|---|---|---|
| 1 | `products-launch.ts` | 50 launch products (41 active) | 22 Nov 2026 |
| 2 | `products-2026-11.ts` | 100 products: 30 groceries, 20 beauty, 30 luxury, 20 one-off (93 active) | 24 Nov 2026 |

Every active record carries `priceINR`, `priceType`, `priceSource` (the page the price was seen
on) and `verifiedAt`. Unverified records are `active: false` with the reason in `notes`, and the
selector never uses them. `products.test.ts` enforces this, checks the 30/20/30/20 split, and
proves a valid daily quiz exists for every day of the next year.

**Pool 2 inactive (7):** Everest Kitchen King (retailers disagree), Oral-B iO2 (only a marketplace
MRP, which conflicts with launch pricing), PS5 Pro (not officially sold in India), and Swarovski Matrix
Tennis, Michael Kors Jet Set, Oakley Holbrook and Pandora Moments (no verifiable India price).

**Lower-certainty actives worth a re-check** are flagged in `notes`: most cars and all two-wheelers
come from CarDekho/CarWale/BikeWale/BikeDekho where the maker's site wouldn't render; Omega,
TAG Heuer and Rado come from authorised Indian retailers; Bose and GoPro are retailer MRPs;
Head & Shoulders uses P&G's official revised-MRP list over a conflicting retailer figure. Both
homes are developer "onwards" prices for a named configuration.

To add a pool: create `products-<yyyy-mm>.ts` with `pool: N` on every record, add it to
`products.ts`, and add `{ pool: N, from: "<IST date>" }` to `POOLS`. Pick a date after the deploy.

## Scoring

`1000 × e^(−k·|ln(guess/actual)|)` with `k = SCORE_STEEPNESS` (`src/lib/scoring.ts`). Launch used
k = 3; it is now **1.5**, which halves the penalty: 10% off scores 867, 20–25% off scores 716, and
half or double the price scores 354. Bands (800 / 600 / 400) are unchanged.

## Images

Product photos are local WebPs in `public/products/<id>.webp` (133 files, ~4 MB, ≤ 900 px,
white margins trimmed). `products.test.ts` fails if a referenced image is missing. Only one
active product, Longines Master Collection, has no photo (longines.com blocks image fetches)
and shows the typographic plate. If an image fails or takes over 6 s, the card
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
