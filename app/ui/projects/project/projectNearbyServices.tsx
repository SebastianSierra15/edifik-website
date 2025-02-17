import { NearbyService } from "@/lib/definitios";
//import { FaSchool, FaStore, FaHospital, FaChild } from "react-icons/fa";
import DetailCard from "./detailCard";
//import { motion } from "framer-motion";

type ProjectNearbyServicesProps = {
  services: NearbyService[];
};

const serviceIcons: { [key: string]: JSX.Element } = {
  Colegios: <FaSchool className="text-yellow-600" />,
  Comercio: <FaStore className="text-yellow-600" />,
  "Centros de Salud": <FaHospital className="text-yellow-600" />,
  "Parque de Juegos": <FaChild className="text-yellow-600" />,
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
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <DetailCard
              icon={serviceIcons[service.name] || <FaStore />}
              label={service.name}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
