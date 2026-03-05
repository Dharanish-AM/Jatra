import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { Maximize2, Minimize2 } from 'lucide-react';

function MapResizer({ isFullscreen }) {
  const map = useMap();

  useEffect(() => {
    // Wait for DOM layout/transitions to settle before invalidating size
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  return null;
}

const cityCoords = {
  Delhi: [28.6139, 77.209],
  Varanasi: [25.3176, 82.9739],
  Agra: [27.1767, 78.0081],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Bhubaneswar: [20.2961, 85.8245],
  Goa: [15.2993, 74.124],
};

export default function RouteMap({ from, to }) {
  const origin = cityCoords[from];
  const destination = cityCoords[to];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routePath, setRoutePath] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
      if (!apiKey) {
        setRoutePath([origin, destination]);
        return;
      }

      try {
        // Mapbox Directions API takes coordinates as longitude,latitude
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?geometries=geojson&access_token=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Convert GeoJSON coords (lng, lat) back to Leaflet format (lat, lng)
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoutePath(coords);
        } else {
          setRoutePath([origin, destination]); // fallback
        }
      } catch (error) {
        console.error("Error fetching route from Mapbox:", error);
        setRoutePath([origin, destination]); // fallback
      }
    };

    fetchRoute();
  }, [origin, destination]);

  if (!origin || !destination) return null;

  const center = [(origin[0] + destination[0]) / 2, (origin[1] + destination[1]) / 2];

  return (
    <div className={isFullscreen ? "fixed inset-0 z-[200] bg-card-bg" : "h-56 rounded-2xl overflow-hidden border border-border-light shadow-sm relative"}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(!isFullscreen);
        }}
        className="absolute top-2 right-2 z-[400] p-2 bg-primary-bg/90 backdrop-blur-sm rounded-lg shadow-md border border-border hover:bg-white/10 transition-colors"
        aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5 text-text-primary" /> : <Maximize2 className="w-5 h-5 text-text-primary" />}
      </button>

      <MapContainer center={center} zoom={5} scrollWheelZoom={isFullscreen} className="h-full w-full z-[100]" aria-label="Trip route map">
        <MapResizer isFullscreen={isFullscreen} />
        {import.meta.env.VITE_MAPBOX_API_KEY ? (
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        <Marker position={origin}>
          <Popup>{from} (Origin)</Popup>
        </Marker>
        <Marker position={destination}>
          <Popup>{to} (Destination)</Popup>
        </Marker>
        {routePath && (
          <Polyline positions={routePath} color="#f97316" weight={4} opacity={0.8} />
        )}
      </MapContainer>
    </div>
  );
}
