# Žagarė for today

Interactive guide to **Žagarė** — a small town in northern Lithuania
(Joniškis district, near the Latvian border). Points of interest, category
filtering, photos, and links to further reading, laid out as an editorial
magazine spread rather than a dashboard.

Live at **[zagare.today](https://zagare.today)**. Static frontend only — no
backend, no database, no login. Content is in Lithuanian.

## Stack

- [**Astro 6**](https://astro.build) — static site, file-based routing
- [**React 19**](https://react.dev) as an Astro island, client-only, just for the map
- [**Tailwind CSS v4**](https://tailwindcss.com) via `@tailwindcss/vite`
- [**Leaflet**](https://leafletjs.com) + [**react-leaflet**](https://react-leaflet.js.org) with **CartoDB Positron** tiles (free, no API key)
- Self-hosted fonts via `@fontsource/*` — Instrument Serif, IBM Plex Sans, IBM Plex Mono
- TypeScript (strict)

## Run it

```sh
npm install
npm run dev          # dev server at http://localhost:4321
npm run build        # static build → ./dist
npm run preview      # preview the production build locally
```

Requires Node **24+**.

## Adding or editing points

Points live in [`src/data/points.ts`](src/data/points.ts) as a typed array.
Add a new entry to `POINTS`:

```ts
{
  id: "unique-slug",
  name: "Place name",
  description: "2–3 sentence blurb in Lithuanian.",
  category: "historical",            // see Category union
  lat: 56.35932633637436,
  lng: 23.25505980327554,
  images: [img("place.webp")],       // optional, drop files in src/assets/points/
  wikiUrl: "https://…",              // optional
  instagramUrl: "https://…",         // optional
}
```

**Images** go in `src/assets/points/` as **WebP**, **≤700px** on the
longest side. Reference them by filename via the `img()` helper — no import
statements to maintain. Convert + resize with `cwebp` (Homebrew:
`brew install webp`):

```sh
cwebp -q 80 -resize 700 0 in.jpg -o out.webp     # landscape source
cwebp -q 80 -resize 0 700 in.jpg -o out.webp     # portrait source
```

`-resize 700 0` caps width at 700, height auto-scales (and vice versa).
For source files much larger than 1500px, downscale first with
`sips -Z 1000 in.jpg --out resized.jpg`, then `cwebp` it.

**Coordinates** — right-click a place on Google Maps and click the decimal
pair at the top of the menu to copy it.

**Adding a new category** — extend the `Category` union in `points.ts` and
add a matching entry to `CATEGORIES` with a Lithuanian `label` and a hex
`color`. The filter list and marker rendering are entirely data-driven.

## Structure

```
src/
  assets/
    logos/                   Brand mark in three variants (dark / red / white)
    points/                  Photos for map points (WebP, ≤700px)
  components/
    Map.tsx                  MapExperience — state + map container + auto-fit
    CategoryFilter.tsx       Desktop filter sidebar
    CategoryList.tsx         Shared category list (used by sidebar + sheet)
    CategoryGlyph.tsx        Lucide-derived category icons (React + raw SVG)
    MobileFilterSheet.tsx    Bottom-sheet filter on mobile
    PointPopup.tsx           Popup body, image carousel, external links
  data/
    points.ts                POINTS, CATEGORIES, CATEGORY_COUNTS, img() helper
  layouts/
    Layout.astro             <head>, header (logo + coords), <slot />
  pages/
    index.astro              Hero + map + JSON-LD (the only page, for now)
  styles/
    global.css               Tailwind v4, @theme tokens, @utility classes, Leaflet overrides
public/
  _headers                   Cloudflare cache + security headers
  robots.txt                 Allow all + sitemap pointer
  favicon.svg, og.png        Site assets served as-is
astro.config.mjs             React + sitemap integrations, Tailwind Vite plugin
```

## Design direction

Editorial / magazine aesthetic. Warm paper background (`#eaddca`),
near-black ink (`#141210`), deep red brand accent (`#960000` — matches the
logo). Typography pairs **Instrument Serif** (display) with **IBM Plex
Sans** (body) and **IBM Plex Mono** (metadata). Coordinates are shown in
DDM format. Interactive elements favor restraint over emphasis.

## Deploy

Cloudflare Pages, static. Build command `npm run build`, output directory
`dist/`. The domain is managed in Cloudflare. The build emits a
`sitemap-index.xml` automatically.

## License

Content (photos, descriptions) — rights belong to their respective owners;
check per-image attribution. Site code — internal project, not currently
open-sourced.
