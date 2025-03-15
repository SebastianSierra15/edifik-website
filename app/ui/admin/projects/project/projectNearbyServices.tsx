import dynamic from "next/dynamic";
import { NearbyService } from "@/lib/definitios";
import DetailCard from "./detailCard";

const School = dynamic(() => import("lucide-react").then((mod) => mod.School));
const Store = dynamic(() => import("lucide-react").then((mod) => mod.Store));
const Hospital = dynamic(() =>
  import("lucide-react").then((mod) => mod.Hospital)
);
const Smile = dynamic(() => import("lucide-react").then((mod) => mod.Smile));

interface ProjectNearbyServicesProps {
  services: NearbyService[];
}

const serviceIcons: { [key: string]: JSX.Element } = {
  Colegios: <School className="text-yellow-600" />,
  Comercio: <Store className="text-yellow-600" />,
  "Centros de Salud": <Hospital className="text-yellow-600" />,
  "Parque de Juegos": <Smile className="text-yellow-600" />,
};

export default function ProjectNearbyServices({
  services,
}: ProjectNearbyServicesProps) {
  return (
    <div className="my-8">
      <h2 className="mb-6 text-2xl font-semibold text-[#8B4513]">
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
