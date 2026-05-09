export type LatLng = [number, number];

export function trackKm(points: LatLng[]): number {
  if (points.length < 2) return 0;
  const R = 6371;
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    const [lat1, lng1] = points[i - 1];
    const [lat2, lng2] = points[i];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    sum += 2 * R * Math.asin(Math.sqrt(a));
  }
  return sum;
}
