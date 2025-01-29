"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const customIcon = L.icon({
  iconUrl: "/custom-marker.svg", // Path to your custom marker image
  iconSize: [38, 38], // Size of the icon [width, height]
  iconAnchor: [19, 38], // Anchor point of the icon (tip of the marker)
  popupAnchor: [0, -38], // Anchor point for the popup relative to the icon
});

const Map = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  useEffect(() => {
    // Create map
    const map = L.map("map").setView([latitude, longitude], 15);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker with custom icon
    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup("Ubicación de la emergencia")
      .openPopup();

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div id="map" className="w-10/12 h-80 mx-auto my-6 z-20"></div>
    </>
  );
};

export default Map;
