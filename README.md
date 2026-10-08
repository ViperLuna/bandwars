# Band Wars

A band-management sim: form a band, write songs, play gigs, climb the charts.

## Dev
- `npm run dev` – local dev server
- `npm test` – unit tests
- `npm run build` – typecheck + production build (deployed to GitHub Pages via Actions on push to `main`)

## Layout
- `src/game/` – pure game logic (no React)
- `src/ui/` – React UI (panels, components)
- `src/data/` – JSON content: genres, bands, cities, portraits
