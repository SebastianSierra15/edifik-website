import { Property } from "@/lib/definitios";
import {
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCouch,
  FaHome,
} from "react-icons/fa";

type PropertyDetailsProps = {
  property: Property;
};

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: "#8B4513" }}>
        Detalles de la Propiedad
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailCard
          icon={<FaRulerCombined style={{ color: "#DAA520" }} />}
          label="Área construida"
          value={`${property.builtArea} m²`}
        />
        <DetailCard
          icon={<FaRulerCombined style={{ color: "#DAA520" }} />}
          label="Área total"
          value={`${property.totalArea} m²`}
        />
        <DetailCard
          icon={<FaBed style={{ color: "#DAA520" }} />}
          label="Habitaciones"
          value={property.rooms.toString()}
        />
        <DetailCard
          icon={<FaBath style={{ color: "#DAA520" }} />}
          label="Baños"
          value={property.bathrooms.toString()}
        />
        <DetailCard
          icon={<FaCouch style={{ color: "#DAA520" }} />}
          label="Salas de estar"
          value={property.lobbies.toString()}
        />
        <DetailCard
          icon={<FaHome style={{ color: "#DAA520" }} />}
          label="Tipo de Vivienda"
          value={property.housingType.name}
        />
      </div>
    </div>
  );
}

type DetailCardProps = {
  icon: JSX.Element;
  label: string;
  value: string;
};

function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div
      className="flex items-center p-4 shadow-md rounded-lg"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="p-3 rounded-full mr-4"
        style={{ backgroundColor: "#EDEDED" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#5D4037" }}>
          {label}
        </p>
        <p className="text-lg font-bold" style={{ color: "#8B4513" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
