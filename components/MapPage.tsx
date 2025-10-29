"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapPage({
  latitude,
  longitude,
  className,
}: {
  latitude: number;
  longitude: number;
  className?: string;
}) {

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      className={`${className}`}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='<a href="https://www.openstreetmap.org/copyright"></a> '
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        icon={L.icon({
          iconUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        })}
      >
        <Popup>مكان الفندق</Popup>
      </Marker>
    </MapContainer>
  );
}
