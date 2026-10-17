import type { Coordinates } from "./types/map";

export function isValidCoordinates({
  latitude,
  longitude,
}: Coordinates): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
}
