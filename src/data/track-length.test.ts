import { describe, expect, it } from "vitest";
import { trackKm, type LatLng } from "./track-length";

describe("trackKm", () => {
  it("returns 0 for empty array", () => {
    expect(trackKm([])).toBe(0);
  });

  it("returns 0 for single point", () => {
    expect(trackKm([[0, 0]])).toBe(0);
  });

  it("returns 0 for two identical points", () => {
    const p: LatLng = [56.353458, 23.223802];
    expect(trackKm([p, p])).toBe(0);
  });

  it("computes 1° of latitude as ~111.19 km on a meridian", () => {
    // Mean meridional arc length per degree at the WGS-84 spherical approx
    // (R = 6371 km) is π·R/180 ≈ 111.1949 km.
    const km = trackKm([
      [0, 0],
      [1, 0],
    ]);
    expect(km).toBeCloseTo(111.1949, 3);
  });

  it("computes 1° of longitude at the equator as ~111.19 km", () => {
    const km = trackKm([
      [0, 0],
      [0, 1],
    ]);
    expect(km).toBeCloseTo(111.1949, 3);
  });

  it("scales longitude by cos(latitude) at high latitude", () => {
    // At 60°N, 1° lon ≈ 111.1949 * cos(60°) ≈ 55.597 km.
    const km = trackKm([
      [60, 0],
      [60, 1],
    ]);
    expect(km).toBeCloseTo(55.597, 2);
  });

  it("sums multi-segment polyline", () => {
    // Three colinear points along a meridian: 0 → 1 → 2 lat. Total = 2°.
    const km = trackKm([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    expect(km).toBeCloseTo(2 * 111.1949, 3);
  });

  it("is direction-invariant (forward = reverse)", () => {
    const fwd: LatLng[] = [
      [56.0, 23.0],
      [56.01, 23.01],
      [56.02, 23.0],
      [56.03, 23.02],
    ];
    const rev = [...fwd].reverse();
    expect(trackKm(fwd)).toBeCloseTo(trackKm(rev), 10);
  });

  it("is additive across a split polyline", () => {
    const a: LatLng[] = [
      [56.0, 23.0],
      [56.01, 23.0],
      [56.02, 23.0],
    ];
    const b: LatLng[] = [
      [56.02, 23.0],
      [56.03, 23.0],
      [56.04, 23.0],
    ];
    const whole: LatLng[] = [...a, ...b.slice(1)];
    expect(trackKm(a) + trackKm(b)).toBeCloseTo(trackKm(whole), 10);
  });

  it("matches expected length of the Ozo trail (~4.48 km)", () => {
    // Smoke check against the simplified track shipped in
    // src/data/tracks/data/ozo-takas.ts. Tolerance 0.05 km absorbs any future
    // re-simplification at the same RDP tolerance.
    const ozoTakas: LatLng[] = [
      [56.353458, 23.223802],
      [56.353208, 23.224101],
      [56.351623, 23.225458],
      [56.351346, 23.225438],
      [56.350642, 23.223703],
      [56.34938, 23.221259],
      [56.34792, 23.218702],
      [56.347414, 23.218088],
      [56.346727, 23.217439],
      [56.347588, 23.214188],
      [56.34673, 23.217438],
      [56.34635, 23.216839],
      [56.345675, 23.215052],
      [56.345351, 23.212628],
      [56.344759, 23.210631],
      [56.344539, 23.210268],
      [56.344549, 23.209541],
      [56.345343, 23.208572],
      [56.345542, 23.208186],
      [56.345939, 23.208574],
      [56.346397, 23.209395],
      [56.349912, 23.214172],
      [56.350308, 23.214324],
      [56.351015, 23.214904],
      [56.353235, 23.220934],
      [56.353465, 23.221901],
      [56.353404, 23.223005],
      [56.353464, 23.223787],
      [56.353687, 23.224289],
      [56.354142, 23.223254],
      [56.354314, 23.223669],
      [56.354244, 23.224049],
      [56.35414, 23.223249],
      [56.35369, 23.224283],
      [56.35418, 23.226121],
      [56.35427, 23.226152],
      [56.354261, 23.226374],
      [56.354661, 23.226899],
      [56.35495, 23.227621],
      [56.354997, 23.228298],
      [56.355886, 23.229095],
      [56.356727, 23.230671],
      [56.357069, 23.230832],
      [56.357414, 23.230814],
      [56.357508, 23.230887],
      [56.357763, 23.231492],
    ];
    expect(trackKm(ozoTakas)).toBeCloseTo(4.48, 1);
  });
});
