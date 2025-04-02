"use client";

import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Search, ShoppingCart, KeySquare, Building2 } from "lucide-react";
import SearchProjects from "./searchProjects";

interface HeroSearchProps {
  projectTypeId: number;
  setProjectTypeId: Dispatch<SetStateAction<number>>;
  setSearchCoords: (coords: { latitude: number; longitude: number }) => void;
}

export default function HeroSearch({
  projectTypeId,
  setProjectTypeId,
  setSearchCoords,
}: HeroSearchProps) {
  return (
    <div className="relative w-full h-72 md:h-96">
      <Image
        src="/images/home/home.webp"
        alt="Fondo buscador"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center px-4">
        <div className="flex gap-4 mb-6">
          {[
            { id: 2, label: "Venta", icon: <ShoppingCart size={16} /> },
            { id: 3, label: "Arriendo", icon: <KeySquare size={16} /> },
            { id: 1, label: "Sobre planos", icon: <Building2 size={16} /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setProjectTypeId(id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition border shadow",
                projectTypeId === id
                  ? "bg-client-accent text-white border-client-accent"
                  : "bg-client-backgroundAlt text-client-text border-client-accent hover:bg-white hover:text-black"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-2xl flex bg-white rounded-md shadow-lg">
          <SearchProjects onSelectLocation={setSearchCoords} />

          <button className="bg-client-accent hover:bg-client-accent-hover px-4 flex items-center justify-center rounded-r-md">
            <Search className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
