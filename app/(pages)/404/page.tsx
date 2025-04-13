"use client";

import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-client-text text-center gap-8">
      <h1 className="text-6xl font-bold">¡Ups! Página no encontrada</h1>

      <p className="text-xl text-client-textSecondary">
        Lo sentimos, pero la página que buscas no existe.
      </p>

      <button
        onClick={goHome}
        className="mt-6 px-6 py-3 bg-client-accent text-white font-semibold rounded-full hover:bg-client-accentHover transition-all"
      >
        Regresar al inicio
      </button>
    </div>
  );
};

export default Custom404;
