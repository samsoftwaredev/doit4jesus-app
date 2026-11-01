"use dom";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

import { createChurchMarkerLabel, escapeChurchMapHtml, getChurchMapBounds } from "../../churches.map";
import type { ChurchMapProps } from "../../churches.types";

/** Renders the interactive Leaflet directory map on web and inside Expo's native DOM bridge. */
export default function ChurchMap({ center, markers, onSelectChurch, selectedChurchId }: ChurchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const centerLatitude = center.latitude;
  const centerLongitude = center.longitude;

  useEffect(
    /** Recreates the lightweight map when search results or selection change. */
    function synchronizeMap() {
      let active = true;

      /** Loads Leaflet only in the DOM runtime and binds accessible result markers. */
      async function initializeMap(): Promise<void> {
        const leafletModule = await import("leaflet");
        if (!active || !containerRef.current) return;
        const L = leafletModule.default;
        mapRef.current?.remove();
        const map = L.map(containerRef.current, { scrollWheelZoom: false });
        mapRef.current = map;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        for (const marker of markers) {
          const selected = marker.id === selectedChurchId;
          const label = createChurchMarkerLabel(marker);
          const icon = L.divIcon({
            className: "church-map-marker-shell",
            html: `<span aria-hidden="true" class="church-map-marker${selected ? " selected" : ""}">✝</span>`,
            iconAnchor: [18, 18],
            iconSize: [36, 36],
          });
          L.marker([marker.latitude, marker.longitude], {
            alt: label,
            icon,
            keyboard: true,
            title: label,
          })
            .addTo(map)
            .bindTooltip(escapeChurchMapHtml(marker.name))
            .on("click", () => void onSelectChurch(marker.id));
        }

        if (markers.length === 0) {
          map.setView([centerLatitude, centerLongitude], 12);
        } else if (markers.length === 1) {
          map.setView([markers[0]!.latitude, markers[0]!.longitude], 14);
        } else {
          map.fitBounds(getChurchMapBounds(markers, { latitude: centerLatitude, longitude: centerLongitude }), {
            padding: [28, 28],
          });
        }
      }

      void initializeMap();
      return () => {
        active = false;
        mapRef.current?.remove();
        mapRef.current = null;
      };
    },
    [centerLatitude, centerLongitude, markers, onSelectChurch, selectedChurchId],
  );

  return (
    <div style={{ height: "100%", minHeight: 320, position: "relative", width: "100%" }}>
      <style>{`
        .leaflet-container { background: #102D45; font-family: system-ui, sans-serif; height: 100%; width: 100%; }
        .church-map-marker-shell { background: transparent; border: 0; }
        .church-map-marker { align-items: center; background: #163A57; border: 2px solid #F1C46A; border-radius: 999px; color: #F1C46A; display: flex; font-size: 20px; height: 32px; justify-content: center; width: 32px; }
        .church-map-marker.selected { background: #245E48; border-color: #ffffff; color: #ffffff; transform: scale(1.12); }
        .leaflet-control-attribution { font-size: 10px; }
      `}</style>
      <div
        aria-label="Church results map"
        ref={containerRef}
        role="application"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
