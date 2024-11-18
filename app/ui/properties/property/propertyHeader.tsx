import React from "react";
import { Property } from "@/lib/definitios";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

type PropertyHeaderProps = {
  property: Property;
};

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="w-full pt-28 px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between">
      {/* Nombre y ubicación */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold" style={{ color: "#8B4513" }}>
          {property.name}
        </h1>
        <div
          className="flex flex-col sm:flex-row sm:items-center text-lg mt-2"
          style={{ color: "#5D4037" }}
        >
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-1" style={{ color: "#DAA520" }} />
            <span>{property.address}</span>
            <span className="mx-2 hidden sm:inline">|</span>
          </div>
          <span className="font-semibold">
            {property.city.name}, {property.city.departament.name}
          </span>
        </div>

        {property.availabeDate && (
          <div
            className="text-sm flex items-center mt-4 sm:hidden"
            style={{ color: "#5D4037" }}
          >
            <FaCalendarAlt className="mr-2" style={{ color: "#DAA520" }} />
            <span>Fecha estimada de entrega:</span>
            <span className="font-semibold ml-1" style={{ color: "#8B4513" }}>
              {new Date(property.availabeDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="text-left sm:text-right mt-10 sm:mt-0">
        <p className="text-3xl font-semibold" style={{ color: "#5D4037" }}>
          {formattedPrice}
        </p>
        {property.availabeDate && (
          <p
            className="text-sm hidden sm:flex lg:flex items-center mt-2"
            style={{ color: "#5D4037" }}
          >
            <FaCalendarAlt className="mr-2" style={{ color: "#DAA520" }} />
            <span>Fecha estimada de entrega:</span>
            <span className="font-semibold ml-1" style={{ color: "#8B4513" }}>
              {new Date(property.availabeDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
