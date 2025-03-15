"use client";

import React, { useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number;
}

interface AnimatedStatsProps {
  stats: Stat[];
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

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
          const increment = Math.ceil(target / 100);

          if (count < target) {
            counter.textContent = (count + increment).toString();
            setTimeout(updateCount, 20);
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
    <div
      ref={sectionRef}
      className="flex flex-col sm:flex-row justify-center items-center text-center w-full gap-y-10 gap-x-10 lg:gap-x-20"
    >
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          {index !== 0 && (
            <div className="h-px w-56 sm:h-16 sm:w-px bg-gray-700"></div>
          )}
          <div key={index} className="flex flex-1 justify-center items-center">
            <div className="text-center px-6">
              <h3 className="text-3xl font-semibold" data-target={stat.value}>
                0
              </h3>
              <p className="text-client-textPlaceholder text-sm">
                {stat.label}
              </p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
