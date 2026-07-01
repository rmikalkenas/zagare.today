import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

const ROUTE: [number, number][] = [
  [56.3622689, 23.24708],
  [56.3619347, 23.2470971],
  [56.3619266, 23.2472245],
  [56.3619054, 23.2473445],
  [56.3618671, 23.2474552],
  [56.361772, 23.2476398],
  [56.3616095, 23.2482116],
  [56.3614719, 23.2485254],
  [56.3613902, 23.248685],
  [56.361311, 23.2487783],
  [56.3610893, 23.2488821],
  [56.3609645, 23.2489719],
  [56.3607727, 23.2491476],
  [56.3606762, 23.2492724],
  [56.360562, 23.2494721],
  [56.3603338, 23.2500127],
  [56.3602272, 23.250297],
  [56.3600598, 23.2509385],
  [56.3600351, 23.2511821],
  [56.3600359, 23.2514183],
  [56.36007, 23.2516234],
  [56.3600773, 23.2517149],
];

const ROUTE_BOUNDS = L.latLngBounds(ROUTE);

const PATH_OPTIONS = {
  color: "#960000",
  weight: 4,
  opacity: 0.85,
} as const;

function pinIcon(color: string, label: string): L.DivIcon {
  const html = `<div style="display:flex;align-items:center;gap:6px;white-space:nowrap">
    <span style="flex:0 0 auto;width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid #eaddca;box-shadow:0 0 0 1px ${color}"></span>
    <span style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#141210;background:#eaddca;padding:2px 6px;border:1px solid rgba(20,18,16,0.2)">${label}</span>
  </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [6, 6],
  });
}

const START_ICON = pinIcon("#141210", "Pradžia");
const END_ICON = pinIcon("#960000", "Pabaiga");

export default function RouteMap() {
  return (
    <div className="h-[280px] md:h-[340px] border border-ink/30 shadow-[0_24px_48px_-28px_rgba(20,18,16,0.3)]">
      <MapContainer
        bounds={ROUTE_BOUNDS}
        boundsOptions={{ padding: [56, 56], maxZoom: 17 }}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline positions={ROUTE} pathOptions={PATH_OPTIONS} />
        <Marker position={ROUTE[0]} icon={START_ICON} />
        <Marker position={ROUTE[ROUTE.length - 1]} icon={END_ICON} />
      </MapContainer>
    </div>
  );
}
