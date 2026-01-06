"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  ArrowUp10,
  Bed,
  Building,
  CalendarDays,
  Car,
  CheckCircle,
  CircleDollarSign,
  DoorOpen,
  House,
  MoveVertical,
  Ruler,
  Shirt,
  Sprout,
  Sun,
  Toilet,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import type { ProjectDetails as ProjectDetailsType } from "@/src/interfaces";
import { DetailCard } from "./DetailCard";

interface ProjectDetailsProps {
  project: ProjectDetailsType;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const details = useMemo(
    () => [
    {
      group: "Características generales",
      items: [
        {
          label: "Conjunto",
          value: project.housingType?.name || "",
          icon: <Building />,
        },
        {
          label: "Área total",
          value:
            project.totalArea && project.totalArea > 0
              ? `${project.totalArea} m²`
              : null,
          icon: <Ruler />,
        },
        {
          label: "Área construida",
          value:
            project.builtArea && project.builtArea > 0
              ? `${project.builtArea} m²`
              : null,
          icon: <Ruler />,
        },
        {
          label: "Altura libre",
          value:
            project.freeHeight && project.freeHeight > 0
              ? `${project.freeHeight} m`
              : null,
          icon: <MoveVertical />,
        },
        {
          label: "Ancho",
          value:
            project.width && project.width > 0 ? `${project.width} m` : null,
          icon: <Ruler />,
        },
        {
          label: "Largo",
          value:
            project.length && project.length > 0 ? `${project.length} m` : null,
          icon: <Ruler />,
        },
        {
          label: "Tipo de Vivienda",
          value: project.housingType?.name || "",
          icon: <House />,
        },
        {
          label: "Unds. Disponibles",
          value:
            project.availableUnits && project.availableUnits > 0
              ? project.availableUnits.toString()
              : null,
          icon: <CheckCircle />,
        },
        {
          label: "Año de Construcción",
          value:
            project.yearBuilt && project.yearBuilt > 0
              ? project.yearBuilt.toString()
              : null,
          icon: <CalendarDays />,
        },
      ],
    },

    ...(project.bedrooms ||
    project.bathrooms ||
    project.lobbies ||
    project.parkingSpots ||
    project.heavyParking ||
    project.towers ||
    project.storageUnits ||
    project.socioeconomicLevel ||
    project.floorNumber
      ? [
          {
            group: "Espacios y comodidades",
            items: [
              {
                label: "Habitaciones",
                value:
                  project.bedrooms && project.bedrooms > 0
                    ? project.bedrooms.toString()
                    : null,
                icon: <Bed />,
              },
              {
                label: "Baños",
                value:
                  project.bathrooms && project.bathrooms > 0
                    ? project.bathrooms.toString()
                    : null,
                icon: <Toilet />,
              },
              {
                label: "Salas de estar",
                value:
                  project.lobbies && project.lobbies > 0
                    ? project.lobbies.toString()
                    : null,
                icon: <Armchair />,
              },
              {
                label: "Parqueaderos",
                value:
                  project.parkingSpots && project.parkingSpots > 0
                    ? project.parkingSpots.toString()
                    : null,
                icon: <Car />,
              },
              {
                label: "Est. vehículos pesados",
                value:
                  project.heavyParking && project.heavyParking > 0
                    ? project.heavyParking.toString()
                    : null,
                icon: <Truck />,
              },
              {
                label: "Torres",
                value:
                  project.towers && project.towers > 0
                    ? project.towers.toString()
                    : null,
                icon: <Building />,
              },
              {
                label: "Bodegas",
                value:
                  project.storageUnits && project.storageUnits > 0
                    ? project.storageUnits.toString()
                    : null,
                icon: <Warehouse />,
              },
              {
                label: "Nivel Socioeconómico",
                value:
                  project.socioeconomicLevel && project.socioeconomicLevel > 0
                    ? project.socioeconomicLevel.toString()
                    : null,
                icon: <CircleDollarSign />,
              },
              {
                label: "Número de Piso",
                value:
                  project.floorNumber && project.floorNumber > 0
                    ? project.floorNumber.toString()
                    : null,
                icon: <ArrowUp10 />,
              },
            ],
          },
        ]
      : []),

    ...(project.propertyType.id === 1001 || project.propertyType.id === 1002
      ? [
          {
            group: "Opciones adicionales",
            items: [
              {
                label: "Personalizable",
                value: project.customizationOptions ? "Sí" : "NO",
                icon: <Wrench />,
              },
              {
                label: "Balcón",
                value: project.balcony ? "Sí" : "No",
                icon: <DoorOpen />,
              },
              {
                label: "Jardín",
                value: project.garden ? "Sí" : "No",
                icon: <Sprout />,
              },
              {
                label: "Cuarto de ropas",
                value: project.laundryArea ? "Sí" : "No",
                icon: <Shirt />,
              },
              {
                label: "Terraza",
                value: project.terrace ? "Sí" : "No",
                icon: <Sun />,
              },
              {
                label: "Elevador",
                value: project.elevator ? "Sí" : "No",
                icon: <ArrowUp10 />,
              },
            ],
          },
        ]
      : []),
    ],
    [project]
  );

  const [openGroups, setOpenGroups] = useState<boolean[]>(
    new Array(details.length).fill(true)
  );

  useEffect(() => {
    setOpenGroups(new Array(details.length).fill(true));
  }, [details.length]);

  const toggleGroup = (index: number) => {
    setOpenGroups((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className="my-8">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Detalles del Proyecto
      </h2>

      <div className="space-y-6">
        {details.map((group, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex cursor-pointer items-center justify-between rounded-lg p-4 shadow bg-white text-client-primary"
              onClick={() => toggleGroup(index)}
            >
              <span className="text-lg font-medium">{group.group}</span>

              <span
                className={`transition-transform text-client-accent ${
                  openGroups[index] ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {openGroups[index] && (
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map(
                  (item, index) =>
                    item.value && (
                      <DetailCard
                        key={index}
                        icon={
                          <div className="text-client-accent">{item.icon}</div>
                        }
                        label={item.label}
                        value={item.value}
                      />
                    )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
