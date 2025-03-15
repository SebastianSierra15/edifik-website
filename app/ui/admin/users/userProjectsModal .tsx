import { useState } from "react";
import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import { useGetUserProjects } from "@/app/hooks/users/useGetUserProjects";
import { useProjectApi } from "@/app/hooks/projects/useProjectApi";
import ModalHeader from "../../modals/admin/modalHeader";
import ProjectCard from "@/app/ui/admin/projects/projectCardAdmin";
import ModalConfirmation from "../../modals/admin/modalConfirmation";
import Alert from "../../alert";
import ProjectCardSkeleton from "../../skeletons/projectCardSkeleton";

interface UserProjectsModalProps {
  show: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserProjectsModal({
  show,
  onClose,
  userId,
}: UserProjectsModalProps) {
  const { submitProject, isProcessing } = useProjectApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  useBodyOverflow(show);

  const { projects, isLoading, totalEntries, refreshUserProjects } =
    useGetUserProjects({
      userId,
      entriesPerPage: 10,
    });

  const handleOpenModal = (id: number, name: string) => {
    setSelectedProject({ id, name });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    const success = await submitProject(selectedProject.id, "delete");

    if (success) {
      setAlertMessage({
        type: "success",
        message: `Propiedad "${selectedProject.name}" eliminada exitosamente.`,
      });
      refreshUserProjects();
    } else {
      setAlertMessage({
        type: "error",
        message: `Error al eliminar la propiedad "${selectedProject.name}".`,
      });
    }

    setIsModalOpen(false);
    setSelectedProject(null);
  };

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
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    images={project.projectMedia}
                    name={project.name}
                    location={project.city.name}
                    price={project.price}
                    area={project.totalArea}
                    bedrooms={project.bedrooms}
                    bathrooms={project.bathrooms}
                    parkingSpots={project.parkingSpots}
                    isFromMap={false}
                    showActions={true}
                    url={`/inmobiliario/${project.id}`}
                    urlEdit={`/admin/propiedades/${project.id}`}
                    onDelete={() => handleOpenModal(project.id, project.name)}
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

      {alertMessage && (
        <Alert
          type={alertMessage.type as "success" | "error"}
          message={alertMessage.message}
        />
      )}

      {isModalOpen && (
        <ModalConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteProject}
          title="Eliminar Propiedad"
          message={`¿Estás seguro de que deseas eliminar la propiedad "${selectedProject?.name}"?`}
          confirmLabel={isProcessing ? "Eliminando..." : "Eliminar"}
          cancelLabel="Cancelar"
          confirmClassName="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        />
      )}
    </div>
  );
}
