"use client";

import Image from "next/image";
import ProfileCard from "./profileCard";

export default function WhoWeAreSection() {
  return (
    <section className="w-full flex flex-col lg:flex-row">
      <div className="relative flex items-center justify-center w-full lg:w-1/2 order-1 min-h-[500px] lg:order-none">
        <div className="relative w-[500px] h-[500px] mx-auto lg:mx-0 lg:ml-auto mt-12 lg:mt-0">
          <Image
            src="https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Vista Aérea/1732917153053/93863f76-3413-4b02-82f4-77ac0edb9d66.webp"
            alt="Edifik"
            fill
            className="object-cover grayscale bg-black"
          />

          <div className="absolute inset-0 z-20 flex items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] m-auto">
            <Image
              src="/images/logo.webp"
              alt="Logo Edifik"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 pr-6 py-16 lg:py-20 flex flex-col justify-start gap-6 order-2 lg:order-none">
        <h2 className="pl-6 text-white text-3xl sm:text-4xl font-bold">
          ¿QUIÉNES SOMOS?
        </h2>

        <div className="bg-white rounded-r-3xl p-8 max-w-[90%] text-sm text-black">
          Edifik se especializa en el diseño y desarrollo de proyectos urbanos
          sostenibles. Nos comprometemos con la innovación y la protección del
          medio ambiente, creando espacios que mejoran la calidad de vida.
          Ejemplos como Quintas del Lago reflejan nuestra dedicación a integrar
          modernidad y naturaleza, usando recursos naturales y prácticas
          eco-amigables. En Edifik, diseñamos entornos funcionales y ecológicos
          para un futuro sostenible.
        </div>

        <div className="flex flex-col sm:flex-row gap-10 items-center justify-center mt-6">
          {/*
          <ProfileCard
            image="/images/constructor.jpg"
            name="ALEJANDRO TORRES"
            title="Arquitecto Universidad Piloto"
            role="CEO Edifik Estudios de Arquitectura"
            specialty="Arquitectura"
          />
          */}

          <ProfileCard
            image="/images/constructor.jpg"
            name="ANDRÉS TRUJILLO"
            title="Arquitecto Universidad Piloto"
            role="CEO Edifik Estudios de Arquitectura"
            specialty="Arquitectura"
          />
        </div>
      </div>
    </section>
  );
}
