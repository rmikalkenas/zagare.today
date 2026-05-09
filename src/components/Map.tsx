import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  CATEGORIES,
  CATEGORY_KEYS,
  POINTS,
  type Category,
  type Point,
} from "../data/points";
import { getTrack } from "../data/tracks";
import type { LatLng } from "../data/track-length";
import { categoryGlyphSvg } from "./CategoryGlyph";
import CategoryFilter from "./CategoryFilter";
import MobileFilterSheet from "./MobileFilterSheet";
import PointPopup from "./PointPopup";
import VisibleCount from "./VisibleCount";

const FIT_PADDING: [number, number] = [48, 48];
const FIT_MAX_ZOOM = 16;
const FLY_DURATION = 0.6;
const POPUP_RESERVE_MAX = 320;
const POPUP_RESERVE_MIN = 300;
const POPUP_RESERVE_RATIO = 0.55;
const POPUP_SIDE_MAX = 160;
const POPUP_SIDE_RATIO = 0.42;
const ALL_BOUNDS = L.latLngBounds(
  POINTS.map((p) => [p.lat, p.lng] as [number, number]),
);

const MARKER_ICONS: Record<Category, L.DivIcon> = Object.fromEntries(
  CATEGORY_KEYS.map((c) => {
    const glyph = categoryGlyphSvg(c, 16, 2, "#fff");
    const html = `<div class="category-marker-bg" style="background-color:${CATEGORIES[c].color}">${glyph}</div>`;
    return [
      c,
      L.divIcon({
        html,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16],
      }),
    ];
  }),
) as Record<Category, L.DivIcon>;

const TRACK_PATH_OPTIONS = {
  color: "#960000",
  weight: 4,
  opacity: 0.85,
} as const;

export default function MapExperience() {
  const [active, setActive] = useState<Set<Category>>(
    () => new Set(CATEGORY_KEYS),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openTick, setOpenTick] = useState(0);
  const mapRef = useRef<L.Map | null>(null);

  const clearSelection = () => {
    setSelectedId(null);
    mapRef.current?.closePopup();
  };

  const toggle = (c: Category) => {
    clearSelection();
    setActive((prev) =>
      prev.size === 1 && prev.has(c) ? new Set(CATEGORY_KEYS) : new Set([c]),
    );
  };

  const reset = () => {
    clearSelection();
    setActive(new Set(CATEGORY_KEYS));
  };

  const visible = useMemo(
    () => POINTS.filter((p) => active.has(p.category)),
    [active],
  );

  const selectedTrack = useMemo(() => {
    if (!selectedId) return null;
    const p = visible.find((pt) => pt.id === selectedId);
    return p ? (getTrack(p.id)?.points ?? null) : null;
  }, [selectedId, visible]);

  const selectedMarker = useMemo<LatLng | null>(() => {
    if (!selectedId) return null;
    const p = visible.find((pt) => pt.id === selectedId);
    return p ? [p.lat, p.lng] : null;
  }, [selectedId, visible]);

  return (
    <section className="mx-5 md:mx-8 my-8 md:my-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
      <CategoryFilter active={active} onToggle={toggle} onReset={reset} />

      <div className="md:col-span-8 lg:col-span-9 order-1 md:order-2 flex flex-col">
        <div className="relative h-[60dvh] md:h-[72dvh] border border-ink/30 shadow-[0_24px_48px_-28px_rgba(20,18,16,0.3)]">
          <MapContainer
            ref={mapRef}
            bounds={ALL_BOUNDS}
            boundsOptions={{ padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM }}
            scrollWheelZoom
            className="h-full w-full"
            zoomControl={false}
          >
            <FitToVisible points={visible} />
            <FitToTrack
              track={selectedTrack}
              marker={selectedMarker}
              openTick={openTick}
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {visible.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={MARKER_ICONS[p.category]}
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
                <Popup maxWidth={280} minWidth={240}>
                  <PointPopup point={p} />
                </Popup>
              </Marker>
            ))}
            {selectedTrack && (
              <Polyline
                positions={selectedTrack}
                pathOptions={TRACK_PATH_OPTIONS}
              />
            )}
          </MapContainer>

          <MobileFilterSheet
            active={active}
            onToggle={toggle}
            onReset={reset}
            visibleCount={visible.length}
            totalCount={POINTS.length}
          />
        </div>

        <div className="flex items-baseline justify-between gap-4 mt-3 meta">
          <span>N ↑ · Orientacija į šiaurę</span>
          <span>
            <VisibleCount visible={visible.length} total={POINTS.length} />
          </span>
        </div>
      </div>
    </section>
  );
}

function FitToTrack({
  track,
  marker,
  openTick,
}: {
  track: LatLng[] | null;
  marker: LatLng | null;
  openTick: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!track || track.length === 0 || !marker) return;
    const size = map.getSize();
    const topReserve = Math.max(
      POPUP_RESERVE_MIN,
      Math.min(POPUP_RESERVE_MAX, Math.floor(size.y * POPUP_RESERVE_RATIO)),
    );
    const sidePad = Math.max(
      FIT_PADDING[0],
      Math.min(POPUP_SIDE_MAX, Math.floor(size.x * POPUP_SIDE_RATIO)),
    );
    const bounds = L.latLngBounds(track).extend(marker);
    // Reserve popup space only on the side where the marker sits so the track
    // gets the rest of the viewport for a tight fit.
    const markerEast = marker[1] > bounds.getCenter().lng;
    const padLeft = markerEast ? FIT_PADDING[0] : sidePad;
    const padRight = markerEast ? sidePad : FIT_PADDING[0];
    map.flyToBounds(bounds, {
      paddingTopLeft: [padLeft, topReserve],
      paddingBottomRight: [padRight, FIT_PADDING[1]],
      duration: FLY_DURATION,
      maxZoom: FIT_MAX_ZOOM,
    });
  }, [track, marker, openTick, map]);

  return null;
}

function FitToVisible({ points }: { points: Point[] }) {
  const map = useMap();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (points.length === 0) return;

    if (points.length === 1) {
      map.flyTo([points[0].lat, points[0].lng], FIT_MAX_ZOOM, {
        duration: FLY_DURATION,
      });
      return;
    }

    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.flyToBounds(bounds, {
      padding: FIT_PADDING,
      duration: FLY_DURATION,
      maxZoom: FIT_MAX_ZOOM,
    });
  }, [points, map]);

  return null;
}
