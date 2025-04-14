"use client";

import Link from "next/link";
import { ArrowUpRight, Lightbulb } from "lucide-react";

export default function PitchSection() {
  return (
    <section className="text-client-text py-16 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Tu proyecto de
            <br />
            <span className="inline-flex items-center gap-1">
              forma{" "}
              <span className="text-xl">
                <Lightbulb className="w-9 h-9 text-client-accent" />
              </span>
            </span>
          </h2>

          <p className="text-3xl sm:text-4xl font-light leading-snug mt-4 whitespace-pre-line">
            más inteligente{"\n"}Eficiente,{"\n"}y transparente
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-xl leading-relaxed">
            Imagina que antes de construir tu proyecto, creamos una versión
            digital inteligente de todo el proyecto en 3D. Esto es BIM..
          </p>

          <Link
            href="https://wa.me/573001112233"
            target="_blank"
            className="group inline-flex items-center gap-2 w-fit bg-transparent border border-client-accent text-client-text px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-white hover:text-black transition whitespace-nowrap"
          >
            Saber más
            <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
