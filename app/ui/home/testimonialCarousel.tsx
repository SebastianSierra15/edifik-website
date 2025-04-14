"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "Desde el primer momento en que contacté a Edifik, supe que estaba en buenas manos. Su equipo de arquitectos escuchó atentamente mis ideas y necesidades, y me presentó un diseño que superó mis expectativas.",
    name: "Natalia Ortega",
    role: "Cliente Edifik",
    image: "/images/home/avatar.webp",
  },
  {
    text: "Trabajar con Edifik fue una experiencia increíble. No solo entendieron mi visión, sino que la llevaron a otro nivel con su profesionalismo y creatividad.",
    name: "Laura y Sebastián",
    role: "Clientes Edifik",
    image: "/images/home/avatar.webp",
  },
  {
    text: "La dedicación y atención al detalle de Edifik me dejaron completamente satisfecho. Recomiendo sus servicios sin dudarlo.",
    name: "María Fernanda Ríos",
    role: "Cliente Edifik",
    image: "/images/home/avatar.webp",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative flex items-center justify-center w-full mx-auto px-12 sm:px-16 lg:px-6 py-8 md:py-12 bg-client-backgroundAlt rounded-2xl border border-client-textSecondary">
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 p-2 bg-client-primaryLight rounded-full hover:bg-client-primaryHover transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-client-text" />
      </button>

      <div className="max-w-2xl text-center text-client-textSecondary gap-y-16">
        <p className="text-lg h-60 sm:h-36 md:text-xl font-light leading-relaxed">
          {testimonials[currentIndex].text}
        </p>

        <div className="mt-6 flex justify-center items-center gap-x-4">
          <Image
            src={testimonials[currentIndex].image}
            alt={testimonials[currentIndex].name}
            width={50}
            height={50}
            className="rounded-full border border-client-primary"
          />

          <div className="flex flex-col pr-2 w-36">
            <p className="mt-2 font-semibold">
              {testimonials[currentIndex].name}
            </p>
            <span className="text-sm text-client-textSecondary">
              {testimonials[currentIndex].role}
            </span>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={clsx(
                "h-1 w-20 transition-all",
                index === currentIndex
                  ? "bg-client-white"
                  : "bg-client-textPlaceholder",
                index === 0 && "rounded-l-full",
                index === testimonials.length - 1 && "rounded-r-full"
              )}
            ></div>
          ))}
        </div>
      </div>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 p-2 bg-client-primaryLight rounded-full hover:bg-client-primaryHover transition-all"
      >
        <ChevronRight className="w-6 h-6 text-client-text" />
      </button>
    </section>
  );
}
