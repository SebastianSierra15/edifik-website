"use client";

import clsx from "clsx";
import { KeySquare, ShoppingCart } from "lucide-react";

interface ProjectTypeToggleProps {
  projectTypeId: number;
  setProjectTypeId?: (id: number) => void;
}

export function ProjectTypeToggle({
  projectTypeId,
  setProjectTypeId,
}: ProjectTypeToggleProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      {[
        { id: 2, label: "Venta", icon: <ShoppingCart /> },
        { id: 3, label: "Arriendo", icon: <KeySquare /> },
      ].map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setProjectTypeId && setProjectTypeId(id)}
          className={clsx(
            "flex items-center gap-2 rounded-lg px-6 py-2 shadow-md transition-colors",
            projectTypeId === id
              ? "bg-premium-primary text-white hover:bg-premium-primaryDark dark:bg-premium-primaryLight"
              : "bg-premium-backgroundLight text-premium-primary hover:bg-premium-backgroundDark dark:bg-premium-background dark:text-premium-primaryLight dark:hover:bg-premium-backgroundLight"
          )}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
