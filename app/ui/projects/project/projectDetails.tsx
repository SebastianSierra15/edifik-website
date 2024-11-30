import { motion } from "framer-motion";
import DetailCard from "./detailCard";
import { Project } from "@/lib/definitios";
import {
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCouch,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaCar,
  FaTruck,
  FaArrowUp,
  FaSeedling,
  FaTools,
  FaWindowRestore,
  FaTshirt,
  FaLevelUpAlt,
  FaExpandArrowsAlt,
  FaRulerHorizontal,
  FaRulerVertical,
} from "react-icons/fa";

type ProjectDetailsProps = {
  project: Project;
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const details = [
    {
      group: "Características generales",
      items: [
        {
          label: "Área construida",
          value:
            project.builtArea && project.builtArea > 0
              ? `${project.builtArea} m²`
              : null,
          icon: <FaRulerCombined />,
        },
        {
          label: "Área total",
          value:
            project.totalArea && project.totalArea > 0
              ? `${project.totalArea} m²`
              : null,
          icon: <FaRulerCombined />,
        },
        {
          label: "Altura libre",
          value:
            project.freeHeight && project.freeHeight > 0
              ? `${project.freeHeight} m`
              : null,
          icon: <FaExpandArrowsAlt />,
        },
        {
          label: "Ancho",
          value:
            project.width && project.width > 0 ? `${project.width} m` : null,
          icon: <FaRulerHorizontal />,
        },
        {
          label: "Largo",
          value:
            project.length && project.length > 0 ? `${project.length} m` : null,
          icon: <FaRulerVertical />,
        },
        {
          label: "Tipo de Vivienda",
          value: project.housingType?.name || "",
          icon: <FaHome />,
        },
      ],
    },
    {
      group: "Espacios y comodidades",
      items: [
        {
          label: "Habitaciones",
          value:
            project.bedrooms && project.bedrooms > 0
              ? project.bedrooms.toString()
              : null,
          icon: <FaBed />,
        },
        {
          label: "Baños",
          value:
            project.bathrooms && project.bathrooms > 0
              ? project.bathrooms.toString()
              : null,
          icon: <FaBath />,
        },
        {
          label: "Salas de estar",
          value:
            project.lobbies && project.lobbies > 0
              ? project.lobbies.toString()
              : null,
          icon: <FaCouch />,
        },
        {
          label: "Parqueaderos",
          value:
            project.parkingSpots && project.parkingSpots > 0
              ? project.parkingSpots.toString()
              : null,
          icon: <FaCar />,
        },
        {
          label: "Ascensores",
          value:
            project.elevators && project.elevators > 0
              ? project.elevators.toString()
              : null,
          icon: <FaArrowUp />,
        },
        {
          label: "Est. vehículos pesados",
          value:
            project.heavyParking && project.heavyParking > 0
              ? project.heavyParking.toString()
              : null,
          icon: <FaTruck />,
        },
        {
          label: "Torres",
          value:
            project.towers && project.towers > 0
              ? project.towers.toString()
              : null,
          icon: <FaBuilding />,
        },
        {
          label: "Bodegas",
          value:
            project.storageUnits && project.storageUnits > 0
              ? project.storageUnits.toString()
              : null,
          icon: <FaWarehouse />,
        },
      ],
    },
    {
      group: "Opciones adicionales",
      items: [
        {
          label: "Personalizable",
          value: project.customizationOptions ? "Sí" : "NO",
          icon: <FaTools />,
        },
        {
          label: "Balcón",
          value: project.balcony ? "Sí" : "No",
          icon: <FaWindowRestore />,
        },
        {
          label: "Jardín",
          value: project.garden ? "Sí" : "No",
          icon: <FaSeedling />,
        },
        {
          label: "Cuarto de ropas",
          value: project.laundryArea ? "Sí" : "No",
          icon: <FaTshirt />,
        },
        {
          label: "Terraza",
          value: project.terrace ? "Sí" : "No",
          icon: <FaLevelUpAlt />,
        },
      ],
    },
  ];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-6 text-[#8B4513]">
        Detalles del Proyecto
      </h2>
      <div className="space-y-6">
        {details.map((group, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
          >
            {index !== 0 && <hr className="my-3 border-t border-amber-950" />}
            <h3 className="text-lg font-semibold text-brown-500 mb-4">
              {group.group}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {group.items.map(
                (item, index) =>
                  item.value && (
                    <DetailCard
                      key={index}
                      icon={
                        <motion.div
                          className="text-yellow-600"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.icon}
                        </motion.div>
                      }
                      label={item.label}
                      value={item.value}
                    />
                  )
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
