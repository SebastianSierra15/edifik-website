"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { PropertySummary } from "@/lib/definitios";
import PropertyCard from "./propertyCard";
import PriceMarker from "./PriceMarker";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

type PropertiesMapProps = {
  properties: PropertySummary[];
};

export default function PropertiesMap({ properties }: PropertiesMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertySummary | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const center: [number, number] = [4.5709, -74.2973];

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={properties.length}
        center={center}
        zoom={7}
        minZoom={4}
        className="w-full h-full relative z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Marcadores de propiedades (botones con precios) */}
        {properties.map((property) => (
          <PriceMarker
            key={property.id}
            position={[property.latitude, property.longitude]}
            price={property.price}
            onClick={() => setSelectedProperty(property)}
            isSelected={selectedProperty?.id === property.id}
          />
        ))}
      </MapContainer>

      {/* Mostrar la tarjeta de propiedad seleccionada */}
      {selectedProperty && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-50 bg-transparent shadow-lg rounded-lg w-72">
          <PropertyCard
            images={[
              "/images/image2.jpg",
              "/images/image3.jpg",
              "/images/image4.jpg",
            ]}
            name={selectedProperty.name}
            location={`${selectedProperty.city.name}, ${selectedProperty.city.departament.name}`}
            price={selectedProperty.price}
            area={0}
            idMembership={selectedProperty.membership}
            isFromMap={true}
            onClose={handleCloseCard}
            url={`/admin/propiedades/${selectedProperty.id}`}
          />
        </div>
      )}
    </div>
  );
}
