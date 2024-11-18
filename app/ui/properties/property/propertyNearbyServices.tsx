import { NearbyService } from "@/lib/definitios";
import { FaSchool, FaStore, FaHospital, FaChild } from "react-icons/fa";

type PropertyNearbyServicesProps = {
  services: NearbyService[];
};

const serviceIcons: { [key: string]: JSX.Element } = {
  Colegios: <FaSchool style={{ color: "#DAA520" }} />,
  Comercio: <FaStore style={{ color: "#DAA520" }} />,
  "Centros de Salud": <FaHospital style={{ color: "#DAA520" }} />,
  "Parque de Juegos": <FaChild style={{ color: "#DAA520" }} />,
};

export default function PropertyNearbyServices({
  services,
}: PropertyNearbyServicesProps) {
  return (
    <div className="my-8">
      <h2 style={{ color: "#8B4513" }} className="text-2xl font-semibold mb-4">
        Servicios Cercanos
      </h2>
      <ul className="list-none">
        {services.map((service) => (
          <li
            key={service.id}
            className="flex items-center mb-3 p-4 rounded-lg shadow-md max-w-64"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: "#EDEDED" }}
            >
              {serviceIcons[service.name]}
            </span>
            <span className="font-semibold" style={{ color: "#5D4037" }}>{service.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
