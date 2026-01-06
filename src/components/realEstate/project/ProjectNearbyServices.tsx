import { Hospital, School, Smile, Store } from "lucide-react";
import type { ProjectDetails } from "@/src/interfaces";
import { DetailCard } from "./DetailCard";

interface ProjectNearbyServicesProps {
  services: ProjectDetails["nearbyServices"];
}

const serviceIcons: { [key: string]: JSX.Element } = {
  Colegios: <School className="text-client-accent" />,
  Comercio: <Store className="text-client-accent" />,
  "Centros de Salud": <Hospital className="text-client-accent" />,
  "Parque de Juegos": <Smile className="text-client-accent" />,
};

export function ProjectNearbyServices({
  services,
}: ProjectNearbyServicesProps) {
  return (
    <div className="my-8">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Servicios Cercanos
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.id}>
            <DetailCard
              icon={serviceIcons[service.name] || <Store />}
              label={service.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
