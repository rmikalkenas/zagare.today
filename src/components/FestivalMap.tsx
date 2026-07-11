import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  FESTIVAL_CENTER,
  FESTIVAL_POINTS,
  type FestivalIcon,
} from "../data/festival";
import FestivalPopup from "./FestivalPopup";

const FIT_PADDING: [number, number] = [48, 48];
const FIT_MAX_ZOOM = 16;
const EMPTY_ZOOM = 15;
const FLY_DURATION = 0.6;
const POPUP_RESERVE = 300;
const MARKER_COLOR = "#960000";
const PARKING_COLOR = "#1565c0";

// Marker circle color per glyph; defaults to brand red.
const ICON_COLOR: Partial<Record<FestivalIcon, string>> = {
  parking: PARKING_COLOR,
};

const PATH_OPTIONS = {
  color: MARKER_COLOR,
  weight: 4,
  opacity: 0.85,
} as const;

// Per-point marker glyphs (Lucide-derived), white stroke on brand-red circle.
const FESTIVAL_ICON_PATHS: Record<FestivalIcon, string> = {
  cherry:
    '<path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12"/><path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  parking:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
};

// One divIcon per glyph, built lazily and cached.
const ICON_CACHE = new Map<FestivalIcon, L.DivIcon>();

function markerIcon(name: FestivalIcon = "star"): L.DivIcon {
  const cached = ICON_CACHE.get(name);
  if (cached) return cached;
  const color = ICON_COLOR[name] ?? MARKER_COLOR;
  const glyph = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FESTIVAL_ICON_PATHS[name]}</svg>`;
  const icon = L.divIcon({
    html: `<div class="category-marker-bg" style="background-color:${color}">${glyph}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
  ICON_CACHE.set(name, icon);
  return icon;
}

const BOUNDS =
  FESTIVAL_POINTS.length > 0
    ? L.latLngBounds(
        FESTIVAL_POINTS.map((p) => [p.lat, p.lng] as [number, number]),
      )
    : null;

export default function FestivalMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openTick, setOpenTick] = useState(0);

  const selected = useMemo(
    () => FESTIVAL_POINTS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );
  const selectedPath = selected?.path ?? null;
  const selectedMarker: [number, number] | null = selected
    ? [selected.lat, selected.lng]
    : null;

  return (
    <section className="mx-5 md:mx-8 my-8 md:my-12 flex flex-col">
      <div className="relative h-[60dvh] md:h-[72dvh] border border-ink/30 shadow-[0_24px_48px_-28px_rgba(20,18,16,0.3)]">
        <MapContainer
          {...(BOUNDS
            ? {
                bounds: BOUNDS,
                boundsOptions: { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM },
              }
            : { center: FESTIVAL_CENTER, zoom: EMPTY_ZOOM })}
          scrollWheelZoom
          className="h-full w-full"
          zoomControl={false}
        >
          <FitToPath
            path={selectedPath}
            marker={selectedMarker}
            openTick={openTick}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {FESTIVAL_POINTS.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={markerIcon(p.icon)}
              title={p.name}
              eventHandlers={{
                popupopen: () => {
                  setSelectedId(p.id);
                  setOpenTick((t) => t + 1);
                },
                popupclose: () =>
                  setSelectedId((prev) => (prev === p.id ? null : prev)),
              }}
            >
              <Popup maxWidth={340} minWidth={240}>
                <FestivalPopup point={p} />
              </Popup>
            </Marker>
          ))}
          {selectedPath && (
            <Polyline positions={selectedPath} pathOptions={PATH_OPTIONS} />
          )}
        </MapContainer>
      </div>

      <div className="flex items-baseline justify-between gap-4 mt-3 meta">
        <span>N ↑ · Orientacija į šiaurę</span>
        <span>
          {FESTIVAL_POINTS.length > 0 ? (
            <>
              Rodoma{" "}
              <span className="text-ink tabular-nums">
                {String(FESTIVAL_POINTS.length).padStart(2, "0")}
              </span>{" "}
              taškų
            </>
          ) : (
            "Taškai bus paskelbti netrukus"
          )}
        </span>
      </div>
    </section>
  );
}

// Fly to fit the selected point's path (plus its marker) when the popup opens,
// reserving space at the top so the upward-opening popup does not cover it.
function FitToPath({
  path,
  marker,
  openTick,
}: {
  path: [number, number][] | null;
  marker: [number, number] | null;
  openTick: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!path || path.length === 0 || !marker) return;
    const size = map.getSize();
    const topReserve = Math.min(POPUP_RESERVE, Math.floor(size.y * 0.55));
    const bounds = L.latLngBounds(path).extend(marker);
    map.flyToBounds(bounds, {
      paddingTopLeft: [FIT_PADDING[0], topReserve],
      paddingBottomRight: [FIT_PADDING[1], FIT_PADDING[1]],
      duration: FLY_DURATION,
      maxZoom: FIT_MAX_ZOOM,
    });
  }, [path, marker, openTick, map]);

  return null;
}
