"use client";

import { useEffect, useRef } from "react";
import L, { type LayerGroup, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MarkerItem {
  id: string;
  name: string;
  relation: string;
  lat: number;
  lng: number;
  age: number | null;
  isActive: boolean;
}

interface LeafletFamilyMapProps {
  center: { lat: number; lng: number };
  markers: MarkerItem[];
  onSelectMarker: (memberId: string) => void;
}

export function LeafletFamilyMap({ center, markers, onSelectMarker }: LeafletFamilyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (mapRef.current) return;

    // Defensive reset for dev/hot-reload cycles to prevent "already initialized".
    const raw = container as HTMLElement & { _leaflet_id?: number };
    if (raw._leaflet_id) {
      delete raw._leaflet_id;
    }

    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([center.lat, center.lng], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      markersLayerRef.current?.clearLayers();
      markersLayerRef.current = null;
      map.remove();
      mapRef.current = null;
      if (raw._leaflet_id) {
        delete raw._leaflet_id;
      }
    };
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (markers.length === 0) {
      map.setView([center.lat, center.lng], 11, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(markers.map((item) => [item.lat, item.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.35), { animate: true, maxZoom: 14 });

    for (const member of markers) {
      const marker = L.circleMarker([member.lat, member.lng], {
        radius: member.isActive ? 12 : 9,
        color: member.isActive ? "#16A34A" : "#0EA5E9",
        weight: member.isActive ? 3 : 2,
        fillColor: member.isActive ? "#22C55E" : "#38BDF8",
        fillOpacity: 0.8,
      });

      marker.bindPopup(
        `<div style="min-width:144px">
          <p style="margin:0;font-weight:600">${member.name}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#475569">${member.relation}${
            member.age ? ` • ${member.age} tuổi` : ""
          }</p>
        </div>`,
      );
      marker.on("click", () => onSelectMarker(member.id));
      marker.addTo(markersLayer);
    }
  }, [center.lat, center.lng, markers, onSelectMarker]);

  return <div ref={containerRef} className="h-full w-full" />;
}
