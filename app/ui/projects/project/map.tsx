//import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import "leaflet/dist/leaflet.css";
//import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type ProjectMapProps = {
  latitude: number;
  longitude: number;
  address: string;
};

export default function ProjectMap({
  latitude,
  longitude,
  address,
}: ProjectMapProps) {
  return (
    <div className="my-10">
      {/* Título del Mapa */}
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: "#8B4513" }}>
        Ubicación del Proyecto
      </h2>
      <p className="mb-6 text-lg" style={{ color: "#5D4037" }}>
        Explora la ubicación exacta de tu próximo hogar en el mapa interactivo a
        continuación.
      </p>

      {/* Mapa */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        className="z-10 h-[300px] w-full overflow-hidden rounded-lg"
        style={{
          borderColor: "#DAA520",
          border: "1px solid #5D4037",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            <span style={{ color: "#8B4513", fontWeight: "bold" }}>
              {address}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
