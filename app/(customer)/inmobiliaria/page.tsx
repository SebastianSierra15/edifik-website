"use client"

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
      <div className="relative w-full h-[500px] bg-cover bg-center">
        <Image
          src="/images/image1.png"
          alt="Imagen de nosotros"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-white text-5xl lg:text-7xl text-center">
            Nosotros
          </h1>
        </div>
      </div>

      <div className="px-1 md:px-5 lg:px-16 py-10 bg-gray-200">
        <div className="container mx-auto px-5 py-2 rounded-lg bg-slate-800">
          <h2 className="text-2xl lg:text-4xl pb-5 pt-3 font-bold text-center border-b text-white">
            Propiedades
          </h2>

          <div className="flex justify-between py-2 px-0 md:px-10 text-center border-b border-gray-300 text-white">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab-button px-0 md:px-4 text-md md:text-xl font-semibold border-b-2 border-transparent hover:border-blue-600 ${
                  selectedTab === index ? "text-blue-600 border-blue-600" : ""
                }`}
                onClick={() => handleTabChange(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 mb-2 py-3">
            <div
              className={`grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${
                selectedTab === 0 ? "block" : "hidden"
              }`}
            >

              {/* Otras propiedades */}
            </div>
            {/* Otros div de propiedades ocultos con hidden o visible en función del selectedTab */}
          </div>

          <div className="text-center text-white py-2">
            <button className="rounded-full font-semibold border-2 px-5 py-2 border-white hover:bg-slate-600">
              Mostrar más
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
