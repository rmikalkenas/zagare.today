import { TileLayer } from "react-leaflet";

// CARTO started requiring a free API key on basemaps.cartocdn.com in
// August 2026 - keyless requests get an "API KEY REQUIRED" watermark.
// Get one (no account needed) at https://carto.com/basemaps/apikey and set
// PUBLIC_CARTO_KEY as a build variable. The key is public by design: it ends
// up in the tile URLs the browser requests.
const CARTO_KEY = import.meta.env.PUBLIC_CARTO_KEY;

const CARTO_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const TILE_URL = CARTO_KEY
  ? `${CARTO_LIGHT}?key=${encodeURIComponent(CARTO_KEY)}`
  : CARTO_LIGHT;

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function BaseTileLayer() {
  return <TileLayer attribution={ATTRIBUTION} url={TILE_URL} />;
}
