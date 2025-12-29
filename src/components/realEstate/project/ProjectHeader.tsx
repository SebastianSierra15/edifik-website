import { CalendarDays, MapPin } from "lucide-react";
import type { ProjectDetails } from "@/src/interfaces";
import { formatNumber } from "@/utils/formatters";
import { ShareButton } from "@/src/components/admin";

interface ProjectHeaderProps {
  project: ProjectDetails;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const formattedPrice = formatNumber(project.price ?? 0);

  return (
    <div className="flex flex-col gap-2 w-full px-4 pt-28 sm:px-6 lg:px-12 lg:pt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold text-white">{project.name}</h1>

          <ShareButton message="¡Mira este increíble proyecto en nuestra página web!" />
        </div>

        {formattedPrice && formattedPrice !== "0" && (
          <p className="mt-2 text-3xl font-semibold sm:mt-0 text-white lg:self-end">
            $ {formattedPrice}
          </p>
        )}
      </div>

      <div className="lg:mt-2 lg:grid lg:grid-cols-2 lg:items-start lg:gap-2">
        <div className="flex flex-col text-lg lg:flex-row lg:items-center lg:space-x-2">
          <div className="flex items-center text-white">
            <MapPin className="mr-1 text-client-accent" />

            <span>{project.address}</span>
          </div>

          <span className="hidden lg:inline text-white">|</span>

          <span className="pl-4 font-semibold lg:pl-0 text-client-accent">
            {project.city.name}, {project.city.departament.name}
          </span>
        </div>

        {project.availableDate && (
          <div className="hidden items-center text-sm lg:ml-auto lg:mt-0 lg:flex text-white">
            <CalendarDays className="mr-2 text-client-accent" />

            <span>
              Fecha estimada de entrega:{" "}
              <span className="font-semibold text-client-accent">
                {new Date(project.availableDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </span>
          </div>
        )}
      </div>

      {project.availableDate && (
        <div className="flex items-center text-sm lg:hidden text-white">
          <CalendarDays className="mr-2 text-client-accent" />

          <span>
            Fecha estimada de entrega:{" "}
            {project.availableDate ? (
              <span className="font-semibold text-client-accent">
                {new Date(project.availableDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            ) : (
              <span className="font-semibold text-client-textPlaceholder">
                No disponible
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
