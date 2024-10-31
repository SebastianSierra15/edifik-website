"use client";
import { useState } from "react";
import Loader from "@/app/ui/loader";

export default function page() {
  const [loading, setLoading] = useState(false);

  const startProcess = async () => {
    setLoading(true); // Mostrar el loader

    // Simular un proceso largo con un timeout
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoading(false); // Ocultar el loader
    alert("Proceso completado");
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      {loading && <Loader />} {/* Mostrar el loader si está cargando */}
      <h1 className="text-2xl font-bold mb-4">Simulación del Loader</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={startProcess}
      >
        Iniciar Proceso
      </button>
    </div>
  );
}
