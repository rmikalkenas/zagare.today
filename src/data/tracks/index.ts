// Auto-discover track data files in `./data/`. Filename (without `.ts`) is the
// point id. Each file must default-export a `LatLng[]`.
import { trackKm, type LatLng } from "../track-length";

export interface TrackEntry {
  points: LatLng[];
  lengthKm: number;
}

const trackModules = import.meta.glob<LatLng[]>("./data/*.ts", {
  eager: true,
  import: "default",
});

const TRACKS: Record<string, TrackEntry> = {};
for (const [path, points] of Object.entries(trackModules)) {
  const id = path.replace(/^\.\/data\//, "").replace(/\.ts$/, "");
  TRACKS[id] = { points, lengthKm: trackKm(points) };
}

export const getTrack = (id: string): TrackEntry | undefined => TRACKS[id];
