"use client";
import React from "react";

const words = [
  "ASEGURAR",
  "COMPROMISO",
  "SEGURIDAD",
  "TRANSPARENCIA",
  "EXPERIENCIA",
  "GARANTÍA",
  "CALIDAD",
  "INNOVACIÓN",
  "CONFIANZA",
];

export default function TextCarousel() {
  return (
    <section className="bg-client-backgroundAlt text-white">
      <div className="relative overflow-hidden whitespace-nowrap py-2 group [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
        <div className="animate-slide-left-infinite inline-block w-max">
          {words.map((word, index) => (
            <React.Fragment key={index}>
              <span
                key={index}
                className="mx-4 inline-block text-lg font-semibold"
              >
                {word}
              </span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>

        <div
          className="animate-slide-left-infinite inline-block w-max"
          aria-hidden="true"
        >
          {words.map((word, index) => (
            <React.Fragment key={index}>
              <span
                key={index}
                className="mx-4 inline-block text-lg font-semibold"
              >
                {word}
              </span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
