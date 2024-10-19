"use client";

import { useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

const StatCard = ({ label, value, bgColor, textColor }: Stat) => (
  <div
    className={`w-full md:w-1/2 lg:w-1/4 p-4 ${bgColor} ${textColor} text-center`}
  >
    <h3 className="text-4xl font-bold" data-target={value}>
      0
    </h3>
    <p className="mt-2">{label}</p>
  </div>
);

const stats: Stat[] = [
  {
    label: "Proyectos en Desarrollo",
    value: 15,
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  {
    label: "Proyectos Completados",
    value: 200,
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
  {
    label: "Unidades de Proyectos",
    value: 300,
    bgColor: "bg-gray-800",
    textColor: "text-white",
  },
  {
    label: "Venta de Proyectos",
    value: 150,
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function animateNumbers() {
      const counters =
        sectionRef.current?.querySelectorAll<HTMLHeadingElement>(
          "h3[data-target]"
        );
      if (!counters) return;

      counters.forEach((counter) => {
        const updateCount = () => {
          const target = parseInt(counter.getAttribute("data-target") || "0");
          const count = +counter.textContent!;
          const increment = Math.ceil(target / 200);

          if (count < target) {
            counter.textContent = (count + increment).toString();
            setTimeout(updateCount, 10);
          } else {
            counter.textContent = `${target}+`;
          }
        };
        updateCount();
      });
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.disconnect();
        }
      });
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex justify-center items-center bg-transparent">
      <section
        id="animated-section"
        ref={sectionRef}
        className="absolute z-10 flex flex-wrap justify-center w-full lg:w-4/5"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </section>
    </div>
  );
}
