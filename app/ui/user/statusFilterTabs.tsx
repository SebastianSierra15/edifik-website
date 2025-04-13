"use client";

import clsx from "clsx";

interface StatusFilterTabsProps {
  selected: "aceptado" | "pendiente" | "revision";
  onChange: (status: "aceptado" | "pendiente" | "revision") => void;
}

const statusDescriptions: Record<StatusFilterTabsProps["selected"], string> = {
  aceptado: "Estas son tus propiedades activas, ya visibles en la plataforma.",
  pendiente: "Estas propiedades están esperando revisión por un administrador.",
  revision: "Estas propiedades requieren correcciones antes de ser aprobadas.",
};

export default function StatusFilterTabs({
  selected,
  onChange,
}: StatusFilterTabsProps) {
  const options = [
    { label: "Actuales", value: "aceptado" },
    { label: "Pendientes", value: "pendiente" },
    { label: "En Revisión", value: "revision" },
  ] as const;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex justify-center flex-wrap gap-4">
        {options.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition border shadow",
              selected === value
                ? "bg-client-accent text-white border-client-accent"
                : "bg-client-backgroundAlt text-client-text border-client-accent hover:bg-white hover:text-black"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-client-textSecondary text-sm max-w-md">
        {statusDescriptions[selected]}
      </p>
    </div>
  );
}
