"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

interface ProjectManagerHeaderProps {
  isProperty: boolean;
  children: ReactNode;
}

export function ProjectManagerHeader({
  isProperty,
  children,
}: ProjectManagerHeaderProps) {
  return (
    <div className="-mt-10 bg-premium-backgroundDark px-6 pb-2 pt-8 dark:bg-premium-backgroundLight">
      <h1
        className={clsx(
          "text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight",
          { "mb-10": isProperty, "mb-16": !isProperty }
        )}
      >
        Gestión de {isProperty ? "Propiedades" : "Proyectos"}
      </h1>
      {children}
    </div>
  );
}
