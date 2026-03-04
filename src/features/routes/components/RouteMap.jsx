import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

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

  if (!origin || !destination) return null;

  const center = [(origin[0] + destination[0]) / 2, (origin[1] + destination[1]) / 2];

  return (
    <div className="h-56 rounded-2xl overflow-hidden border border-border-light shadow-sm">
      <MapContainer center={center} zoom={5} scrollWheelZoom={false} className="h-full w-full" aria-label="Trip route map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={origin}>
          <Popup>{from} (Origin)</Popup>
        </Marker>
        <Marker position={destination}>
          <Popup>{to} (Destination)</Popup>
        </Marker>
        <Polyline positions={[origin, destination]} color="#f97316" weight={4} opacity={0.8} />
      </MapContainer>
    </div>
  );
}
