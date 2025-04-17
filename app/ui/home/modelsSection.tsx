"use client";

import Image from "next/image";
import Link from "next/link";

export default function ModelsSection() {
  return (
    <section className="relative flex flex-col items-center justify-center w-full bg-client-background">
      <h1 className="text-6xl sm:text-9xl lg:text-[12rem] font-bold text-white opacity-50 select-none">
        MODELOS
      </h1>

      <div className="relative -translate-y-6 sm:-translate-y-12 lg:-translate-y-16 flex flex-col items-center justify-end w-full h-60 sm:h-80 bg-gradient-to-b from-white/80 to-client-background-dark rounded-2xl shadow-[0px_-20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        <Image
          src="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia4.webp"
          alt="Modelos"
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>

        <div className="relative z-10 text-center text-client-text mb-2">
          <p className="text-md md:text-xl">
            Confía en nosotros para encontrar tu espacio perfecto.
          </p>

          <Link href="/bim">
            <button className="mt-4 px-6 py-2 bg-white text-black rounded-full shadow-md hover:bg-gray-200 transition-all">
              Explora ↗
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
