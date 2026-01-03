import Link from "next/link";
import { Plus, Search } from "lucide-react";

interface ProjectSearchAndCreateProps {
  isProperty: boolean;
  onSearch: (value: string) => void;
}

export function ProjectSearchAndCreate({
  isProperty,
  onSearch,
}: ProjectSearchAndCreateProps) {
  return (
    <div className="mb-10 flex flex-col items-center gap-8 sm:px-6 md:flex-row md:justify-between">
      <div className="relative w-full">
        <input
          name="searchProject"
          type="text"
          placeholder={
            isProperty ? "Buscar propiedades..." : "Buscar proyectos..."
          }
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 pl-10 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-background dark:text-premium-textPrimary"
        />

        <Search className="absolute left-3 top-2 text-premium-textPlaceholder dark:text-premium-textSecondary" />
      </div>

      <Link
        href={
          isProperty
            ? "/admin/inmobiliaria/crear-propiedad"
            : "/admin/proyectos/crear-proyecto"
        }
        className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
      >
        <Plus />
        <span>{isProperty ? "Nueva Propiedad" : "Nuevo Proyecto"}</span>
      </Link>
    </div>
  );
}
