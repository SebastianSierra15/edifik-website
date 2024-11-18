import PropertyCard from "../propertyCard";

type Property = {
  id: number;
  images: string[];
  name: string;
  location: string;
  price: number;
  area: number;
  deliveryTime: string;
  rooms: string;
};

type RecommendedPropertiesProps = {
  properties: Property[];
};

export default function RecommendedProperties({
  properties,
}: RecommendedPropertiesProps) {
  return (
    <div className="my-12 px-8">
      <h2 className="text-3xl font-semibold mb-6" style={{ color: "#5D4037" }}>
        Otras propiedades que podrían interesarte
      </h2>
      <div className="flex overflow-x-auto space-x-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white rounded-lg shadow-md min-w-[250px] max-w-[300px] flex-shrink-0 overflow-hidden"
            style={{
              border: "2px solid #DAA520",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Etiquetas de entrega y habitaciones */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                {property.deliveryTime}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                {property.rooms}
              </span>
            </div>

            {/* Imagen principal de la propiedad */}
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />

            {/* Detalles de la propiedad */}
            <div className="p-4">
              <h3
                className="text-lg font-semibold text-gray-800 line-clamp-1"
                style={{ color: "#5D4037" }}
              >
                {property.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {property.location}
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-2">
                Precio desde
              </p>
              <p className="text-base font-bold" style={{ color: "#8B4513" }}>
                ${property.price.toLocaleString()} COP
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
