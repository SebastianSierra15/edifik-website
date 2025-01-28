"use client";

import { useState } from "react";
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
  FaSeedling,
  FaTools,
  FaArrowsAltV,
  FaTshirt,
  FaRulerHorizontal,
  FaRulerVertical,
  FaCalendarAlt,
  FaSortNumericUp,
  FaMoneyBillWave,
} from "react-icons/fa";
import { PiElevatorFill } from "react-icons/pi";
import {
  MdOutlineBalcony,
  MdOutlineDeck,
  MdOutlineHomeWork,
} from "react-icons/md";
import { RiRuler2Fill } from "react-icons/ri";

type ProjectDetailsProps = {
  project: Project;
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const details = [
    {
      group: "Características generales",
      items: [
        {
          label: "Conjunto",
          value: project.housingType?.name || "",
          icon: <FaBuilding />,
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
          label: "Área construida",
          value:
            project.builtArea && project.builtArea > 0
              ? `${project.builtArea} m²`
              : null,
          icon: <RiRuler2Fill />,
        },
        {
          label: "Altura libre",
          value:
            project.freeHeight && project.freeHeight > 0
              ? `${project.freeHeight} m`
              : null,
          icon: <FaArrowsAltV />,
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
        {
          label: "Unds. Disponibles",
          value:
            project.availableUnits && project.availableUnits > 0
              ? project.availableUnits.toString()
              : null,
          icon: <MdOutlineHomeWork />,
        },
        {
          label: "Año de Construcción",
          value:
            project.yearBuilt && project.yearBuilt > 0
              ? project.yearBuilt.toString()
              : null,
          icon: <FaCalendarAlt />,
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
            project.elevator && project.elevator > 0
              ? project.elevator.toString()
              : null,
          icon: <PiElevatorFill />,
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
        {
          label: "Nivel Socioeconómico",
          value:
            project.socioeconomicLevel && project.socioeconomicLevel > 0
              ? project.socioeconomicLevel.toString()
              : null,
          icon: <FaMoneyBillWave />,
        },
        {
          label: "Número de Piso",
          value:
            project.floorNumber && project.floorNumber > 0
              ? project.floorNumber.toString()
              : null,
          icon: <FaSortNumericUp />,
        },
      ],
    },

    ...(project.propertyType.id === 1001 || project.propertyType.id === 1002
      ? [
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
                icon: <MdOutlineBalcony />,
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
                icon: <MdOutlineDeck />,
              },
            ],
          },
        ]
      : []),
  ];

  const [openGroups, setOpenGroups] = useState<boolean[]>(
    new Array(details.length).fill(true)
  );

  const toggleGroup = (index: number) => {
    setOpenGroups((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className="my-8">
      <h2 className="mb-6 text-2xl font-semibold text-[#8B4513]">
        Detalles del Proyecto
      </h2>
      <div className="space-y-6">
        {details.map((group, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex cursor-pointer items-center justify-between rounded-lg p-4 shadow"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => toggleGroup(index)}
            >
              <span
                className="text-lg font-semibold"
                style={{ color: "#5D4037" }}
              >
                {group.group}
              </span>
              <motion.div
                className={`transition-transform ${
                  openGroups[index] ? "rotate-180" : "rotate-0"
                }`}
                style={{ color: "#DAA520" }}
              >
                ▼
              </motion.div>
            </div>

            {openGroups[index] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
