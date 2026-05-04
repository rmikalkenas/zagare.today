# Žagarė for today

Static frontend-only guide/tourism site for **Žagarė**, a small town in northern
Lithuania (Joniškis district, near the Latvian border). Interactive map of
points of interest with category filtering. Content is in **Lithuanian**
(`lang="lt"`). No backend — ever.

Domain: `zagare.today`. Hosting: **Cloudflare Pages** (the domain is already in
Cloudflare).

## Stack

- **Astro 6** (static output) with file-based routing in `src/pages/`.
- **React 19** as an Astro island, only for the interactive map (`client:only="react"`).
- **Tailwind CSS v4** via `@tailwindcss/vite`. Theme tokens live in
  `src/styles/global.css` under `@theme { … }` — there is **no** `tailwind.config.js`.
- **Leaflet + react-leaflet** with **CartoDB Positron** tiles (free, no API
  key). OSM + CARTO attribution is required and is rendered by Leaflet.
- **TypeScript** strict (`astro/tsconfigs/strict`).
- **Fonts** loaded from Google Fonts: **Instrument Serif** (display, italic
  capable), **IBM Plex Sans** (UI/body), **IBM Plex Mono** (metadata).

## Structure

```
src/
  assets/
    logos/          ZFT_logo-0{1,2,3}.svg  (dark / red / white variants)
    points/         Photos for map points, ≤1000px max dimension
  components/
    Map.tsx         The React island: filter TOC + map + popups
  data/
    points.ts       Point[] array, CATEGORIES record, image imports
  layouts/
    Layout.astro    Shared shell: <head>, header, <slot />
  pages/
    index.astro     Hero + map (the only page for now)
  styles/
    global.css      Tailwind + @theme tokens + Leaflet popup overrides
public/
  favicon.svg       Red logo (ZFT_logo-02)
astro.config.mjs    React integration, Tailwind Vite plugin, build.assets="_assets"
```

## Design system

Aesthetic direction is **editorial / magazine / museum wayfinding** — not
SaaS. Asymmetric layouts, generous negative space, mixed type sizes, mono
metadata as decoration, refined minimalism. Avoid generic "dashboard" or
"startup" styling.

Brand colors (defined as Tailwind theme tokens in `global.css`):

- `--color-paper` `#eaddca` (warm sand cream, body bg)
- `--color-paper-dim` `#dccdb3`
- `--color-ink` `#141210` (near-black warm, text)
- `--color-ink-soft` `#776a55` (metadata / soft text)
- `--color-brand-600` `#960000` (brand red — matches `ZFT_logo-02.svg`)
  plus a full 50→900 scale.

Typography tokens:

- `font-display` → Instrument Serif (large titles, italic accents, popup names)
- `font-sans` → IBM Plex Sans (body copy, UI labels)
- `font-mono` → IBM Plex Mono (uppercase tracking-heavy metadata, numbers,
  coordinates, footer)

Coordinates are displayed in **DDM format** (degrees + decimal minutes), e.g.
`56°21.55958′N / 23°15.30359′E`.

## Data model — `src/data/points.ts`

```ts
type Category =
  | "historical" | "attraction" | "grocery" | "church"
  | "pharmacy"   | "food"       | "crafts"  | "hiking" | "camping";

interface Point {
  id: string;
  name: string;
  description: string;
  category: Category;
  lat: number;
  lng: number;
  images?: ImageMetadata[];   // static imports from src/assets/points/
  wikiUrl?: string;
  instagramUrl?: string;
}
```

`CATEGORIES: Record<Category, { label: string; color: string }>` holds the
Lithuanian label and the marker/filter swatch color per category.

Adding a point: add a new entry to `POINTS`. If it has photos, `curl` them
into `src/assets/points/`, resize to ≤1000px max dimension with
`sips -Z 1000 file.jpg` (Mac), import the image at the top of `points.ts`,
and reference it in the `images` array. Google-served "`.jpg`" URLs are
often WebP in disguise — convert them with
`sips -Z 1000 -s format jpeg in.jpg --out out.jpg`.

Adding a category: extend the `Category` union **and** add an entry to
`CATEGORIES` with `label` (Lithuanian) + `color`. The filter list and marker
rendering are fully data-driven from these.

## Map behavior (`src/components/Map.tsx`)

- **Markers are `CircleMarker`** (not icon markers). This is deliberate — it
  avoids Leaflet's well-known Vite bundling issue with `marker-icon.png`
  assets and gives us per-category color trivially.
- **Filter behavior is solo-select**: clicking a category isolates it
  (turns off all others); clicking the currently-isolated category restores
  all. Clicking a different category swaps the isolate. A "Rodyti viską"
  reset appears in the filter column header only when not-all are active.
- **Auto-fit**: the map initializes via `bounds={ALL_BOUNDS}` on
  `<MapContainer>` (no preset zoom/center). A nested `<FitToVisible>`
  component uses `useMap()` + `useEffect` to `flyToBounds` on filter change.
  A `useRef` flag skips the first effect run so the initial bounds aren't
  re-animated.
- **Popups** show hero image (first of `images`) → small mono category tag
  in category color → italic serif name → body description → footer links
  row with wiki / instagram when defined. Leaflet popup chrome is restyled
  in `global.css` to match the editorial look (flat, ink-bordered, cream).

## Conventions / gotchas

- The package.json name is still `tidal-telescope` — Astro's random scaffold
  default. Rename before shipping; it doesn't affect builds.
- Build output directory is renamed to `_assets/` (not the Astro-default
  `_astro/`) via `astro.config.mjs` → `build.assets`. This is intentional to
  reduce obvious framework fingerprinting in served URLs.
- There is **no `<meta name="generator">`** in the HTML head — deliberately
  removed. Some Astro runtime markers remain in the hydration script
  (`<astro-island>`, etc.); they can't be cleanly hidden without ejecting
  islands.
- The site is Lithuanian. Keep UI copy, popup labels, footer, and
  descriptions in Lithuanian. Typographic quotes: `„…"`.
- The hero title is a three-line staggered composition
  ("Žagarė / for / today") with fluid `clamp()` sizing — do not reduce it
  to a single line without checking the user's intent.
- Images in the React island are imported statically in `points.ts` and
  rendered via `<img src={image.src} …>` inside the popup. They're bundled
  by Vite (not optimized by Astro's `<Image>`) because the popup runs in a
  client-only React tree.
- Leaflet touches `window`, so the map island uses `client:only="react"`
  (no SSR for that component).

## Commands

```bash
npm run dev       # Astro dev server at http://localhost:4321
npm run build     # Static build → ./dist
npm run preview   # Serve ./dist locally
```

## Deployment

Cloudflare Pages, static. Build command: `npm run build`. Output: `dist/`.
The domain is already managed in Cloudflare.
