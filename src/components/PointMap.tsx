import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
  label: string;
}

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

export default function PointMap({ lat, lng, label }: Props) {
  const position: [number, number] = [lat, lng];
  return (
    <div className="h-[280px] md:h-[340px] border border-ink/30 shadow-[0_24px_48px_-28px_rgba(20,18,16,0.3)]">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={pinIcon("#960000", label)} />
      </MapContainer>
    </div>
  );
}
