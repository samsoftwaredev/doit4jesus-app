import type { ChurchMapMarker } from "./churches.types";

/** Produces the marker's visible tooltip and screen-reader label. */
export function createChurchMarkerLabel(marker: ChurchMapMarker): string {
  return `${marker.name}, ${marker.address}`;
}

/** Returns southwest and northeast coordinates covering every marker or the search center. */
export function getChurchMapBounds(
  markers: readonly ChurchMapMarker[],
  center: { latitude: number; longitude: number },
): [[number, number], [number, number]] {
  if (markers.length === 0) {
    return [
      [center.latitude, center.longitude],
      [center.latitude, center.longitude],
    ];
  }
  const latitudes = markers.map((marker) => marker.latitude);
  const longitudes = markers.map((marker) => marker.longitude);
  return [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];
}

/** Escapes API-owned marker copy before placing it in Leaflet's HTML marker icon. */
export function escapeChurchMapHtml(value: string): string {
  return value.replace(
    /[&<>'"]/gu,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!,
  );
}
