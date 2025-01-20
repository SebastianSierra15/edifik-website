import { Project } from "@/lib/definitios";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import ShareButton from "@/app/ui/projects/shareButton";

type ProjectHeaderProps = {
  project: Project;
};

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(project.price);

  return (
    <div className="w-full px-4 pt-28 sm:px-6 lg:px-12 lg:pt-24">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold" style={{ color: "#8B4513" }}>
              {project.name}
            </h1>
            <ShareButton message="¡Mira este increíble proyecto en nuestra página web!" />
          </div>
          <div className="flex flex-col lg:items-end lg:justify-start">
            <p
              className="mt-2 text-3xl font-semibold sm:mt-0"
              style={{ color: "#5D4037" }}
            >
              {formattedPrice}
            </p>
          </div>
        </div>

        <div
          className="lg:mt-2 lg:grid lg:grid-cols-2 lg:items-start lg:gap-2"
          style={{ color: "#5D4037" }}
        >
          <div className="flex flex-col text-lg lg:flex-row lg:items-center lg:space-x-2">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1" style={{ color: "#DAA520" }} />
              <span>{project.address}</span>
            </div>
            <span className="hidden lg:inline">|</span>
            <span className="pl-4 font-semibold lg:pl-0">
              {project.city.name}, {project.city.departament.name}
            </span>
          </div>

          {project.availableDate && (
            <div
              className="hidden items-center text-sm lg:ml-auto lg:mt-0 lg:flex"
              style={{ color: "#5D4037" }}
            >
              <FaCalendarAlt className="mr-2" style={{ color: "#DAA520" }} />
              <span>
                Fecha estimada de entrega:{" "}
                <span className="font-semibold" style={{ color: "#8B4513" }}>
                  {new Date(project.availableDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>

        <div
          className="flex items-center text-sm lg:hidden"
          style={{ color: "#5D4037" }}
        >
          <FaCalendarAlt className="mr-2" style={{ color: "#DAA520" }} />
          <span>
            Fecha estimada de entrega:{" "}
            {project.availableDate ? (
              <span className="font-semibold" style={{ color: "#8B4513" }}>
                {new Date(project.availableDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            ) : (
              <span className="font-semibold text-gray-500">No disponible</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
