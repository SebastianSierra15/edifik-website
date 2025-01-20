"use client";

import Image from "next/image";
import { useState } from "react";

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Destacadas", "Venta", "Sobre Planos", "Arriendo"];

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <main>
      <div className="relative h-[500px] w-full bg-cover bg-center">
        <Image
          src="/images/image1.png"
          alt="Imagen de nosotros"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-center text-5xl text-white lg:text-7xl">
            Nosotros
          </h1>
        </div>
      </div>

      <div className="bg-gray-200 px-1 py-10 md:px-5 lg:px-16">
        <div className="container mx-auto rounded-lg bg-slate-800 px-5 py-2">
          <h2 className="border-b pb-5 pt-3 text-center text-2xl font-bold text-white lg:text-4xl">
            Propiedades
          </h2>

          <div className="flex justify-between border-b border-gray-300 px-0 py-2 text-center text-white md:px-10">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab-button text-md border-b-2 border-transparent px-0 font-semibold hover:border-blue-600 md:px-4 md:text-xl ${
                  selectedTab === index ? "border-blue-600 text-blue-600" : ""
                }`}
                onClick={() => handleTabChange(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mb-2 mt-4 py-3">
            <div
              className={`grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
                selectedTab === 0 ? "block" : "hidden"
              }`}
            >
              {/* Otras propiedades */}
            </div>
            {/* Otros div de propiedades ocultos con hidden o visible en función del selectedTab */}
          </div>

          <div className="py-2 text-center text-white">
            <button className="rounded-full border-2 border-white px-5 py-2 font-semibold hover:bg-slate-600">
              Mostrar más
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
