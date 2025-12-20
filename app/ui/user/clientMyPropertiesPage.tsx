"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useGetMyProjects } from "@/app/hooks/user/useGetMyProjects";
import { useUserProjectApi } from "@/app/hooks/user/useUserProjectApi";
import PropertiesContainer from "@/app/ui/user/propertiesContainer";
import StatusFilterTabs from "@/app/ui/user/statusFilterTabs";
import Alert from "@/src/components/shared/alert/ATlert";

const ModalConfirmation = dynamic(
  () => import("@/app/ui/modals/home/modalConfirmation"),
  { ssr: false }
);

export default function ClientMyPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<
    "aceptado" | "pendiente" | "revision"
  >("aceptado");
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const {
    projects,
    totalEntries,
    fetchMoreMyProjects,
    refreshMyProjects,
    isLoading,
  } = useGetMyProjects({ entriesPerPage: 2, statusProject: statusFilter });

  const { submitUserProject, isProcessing } = useUserProjectApi();

  const handleOpenModal = useCallback((id: number, name: string) => {
    setSelectedProject({ id, name });
    setIsModalOpen(true);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (!selectedProject) return;

    const success = await submitUserProject(selectedProject.id, "delete");

    if (success) {
      setAlertMessage({
        type: "success",
        message: `Propiedad "${selectedProject.name}" eliminada exitosamente.`,
      });

      refreshMyProjects();
    } else {
      setAlertMessage({
        type: "error",
        message: `Error al eliminar la propiedad "${selectedProject.name}".`,
      });
    }

    setIsModalOpen(false);
    setSelectedProject(null);
  }, [selectedProject, submitUserProject, refreshMyProjects]);

  return (
    <>
      <div className="min-h-screen pt-20 pb-16 px-6 sm:px-12 flex flex-col gap-6">
        {alertMessage && (
          <Alert
            type={alertMessage.type as "success" | "warning" | "error" | "info"}
            message={alertMessage.message}
          />
        )}

        {isModalOpen && (
          <ModalConfirmation
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDeleteProject}
            title={"Eliminar Propiedad"}
            message={`¿Estás seguro de que deseas eliminar la propiedad "${selectedProject?.name}"?`}
            confirmLabel={isProcessing ? "Eliminando..." : "Eliminar"}
            cancelLabel="Cancelar"
            confirmClassName="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          />
        )}

        <h1 className="text-2xl sm:text-3xl font-semibold text-client-text text-center">
          Mis propiedades
        </h1>

        <div className="flex flex-col items-center gap-4">
          <StatusFilterTabs
            selected={statusFilter}
            onChange={setStatusFilter}
          />

          <a
            href="/usuario/subir-propiedad"
            className="rounded-full px-6 py-2 bg-client-accent text-white hover:bg-client-accentHover transition-colors"
          >
            Subir Propiedad
          </a>
        </div>

        <hr className="w-full border-client-accent" />

        <p className="text-client-text text-center mx-auto flex items-center">
          <span>{totalEntries}</span>
          <span className="ml-1">resultados</span>
        </p>

        <PropertiesContainer
          projects={projects}
          totalEntries={totalEntries}
          isLoading={isLoading}
          fetchMoreProjects={fetchMoreMyProjects}
          onDelete={handleOpenModal}
          statusFilter={statusFilter}
        />
      </div>
    </>
  );
}
