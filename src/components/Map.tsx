import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
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
import { categoryGlyphSvg } from "./CategoryGlyph";
import CategoryFilter from "./CategoryFilter";
import MobileFilterSheet from "./MobileFilterSheet";
import PointPopup from "./PointPopup";

const FIT_PADDING: [number, number] = [48, 48];
const FIT_MAX_ZOOM = 16;
const FLY_DURATION = 0.6;
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

export default function MapExperience() {
  const [active, setActive] = useState<Set<Category>>(
    () => new Set(CATEGORY_KEYS),
  );

  const toggle = (c: Category) =>
    setActive((prev) =>
      prev.size === 1 && prev.has(c) ? new Set(CATEGORY_KEYS) : new Set([c]),
    );

  const reset = () => setActive(new Set(CATEGORY_KEYS));

  const visible = useMemo(
    () => POINTS.filter((p) => active.has(p.category)),
    [active],
  );

  return (
    <section className="mx-5 md:mx-8 my-8 md:my-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
      <CategoryFilter active={active} onToggle={toggle} onReset={reset} />

      <div className="md:col-span-8 lg:col-span-9 order-1 md:order-2 flex flex-col">
        <div className="relative h-[60dvh] md:h-[72dvh] border border-ink/30 shadow-[0_24px_48px_-28px_rgba(20,18,16,0.3)]">
          <MapContainer
            bounds={ALL_BOUNDS}
            boundsOptions={{ padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM }}
            scrollWheelZoom
            className="h-full w-full"
            zoomControl={false}
          >
            <FitToVisible points={visible} />
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
              >
                <Popup maxWidth={280} minWidth={240}>
                  <PointPopup point={p} />
                </Popup>
              </Marker>
            ))}
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
            Rodoma{" "}
            <span className="text-ink tabular-nums">
              {String(visible.length).padStart(2, "0")}
            </span>
            {" / "}
            <span className="tabular-nums">
              {String(POINTS.length).padStart(2, "0")}
            </span>{" "}
            taškų
          </span>
        </div>
      </div>
    </section>
  );
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
