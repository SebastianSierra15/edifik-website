"use client";

import type { ProjectSummary } from "@/src/interfaces";
import { useBodyOverflow } from "@/src/hooks/ui";
import { ModalHeader } from "@/src/components/shared";
import { ProjectCardAdmin, ProjectCardSkeleton } from "@/src/components/admin";

interface UserProjectsModalProps {
  show: boolean;
  onClose: () => void;
  projects: ProjectSummary[];
  isLoading: boolean;
  totalEntries: number;
  onDeleteProject: (projectId: number, projectName: string) => void;
  onEditProject: (projectId: number) => void;
}

export function UserProjectsModal({
  show,
  onClose,
  projects,
  isLoading,
  totalEntries,
  onDeleteProject,
  onEditProject,
}: UserProjectsModalProps) {
  useBodyOverflow(show);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-4xl overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        {/* Header */}
        <ModalHeader
          title={`Propiedades del Usuario (${totalEntries})`}
          onClose={onClose}
        />

        {/* Body */}
        <div className="h-[80vh] overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))
            : projects.length > 0
              ? projects.map((project) => (
                  <ProjectCardAdmin
                    key={project.id}
                    id={project.id}
                    images={project.projectMedia}
                    name={project.name}
                    location={project.city.name}
                    price={project.price ?? undefined}
                    area={project.totalArea}
                    bedrooms={project.bedrooms ?? undefined}
                    bathrooms={project.bathrooms ?? undefined}
                    parkingSpots={project.parkingSpots ?? undefined}
                    isFromMap={false}
                    url={`/inmobiliario/${project.id}`}
                    onEdit={onEditProject}
                    onDelete={onDeleteProject}
                  />
                ))
              : !isLoading && (
                  <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
                    No hay propiedades asociadas a este usuario.
                  </p>
                )}
        </div>

        <div className="col-span-full h-4" />
      </div>
    </div>
  );
}
