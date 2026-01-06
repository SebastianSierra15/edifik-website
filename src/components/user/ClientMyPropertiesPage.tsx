"use client";

import { useState, useCallback } from "react";
import { useGetMyProjects, useUserProjectApi } from "@/src/hooks/user";
import { useAlert, useClientConfirmation } from "@/src/providers";
import { PropertiesContainer } from "./PropertiesContainer";
import { StatusFilterTabs } from "./StatusFilterTabs";

export function ClientMyPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<
    "aceptado" | "pendiente" | "revision"
  >("aceptado");

  const { showAlert } = useAlert();
  const confirm = useClientConfirmation();

  const {
    projects,
    totalEntries,
    fetchMoreMyProjects,
    refreshMyProjects,
    isLoading,
  } = useGetMyProjects({ entriesPerPage: 16, statusProject: statusFilter });

  const { submitUserProject } = useUserProjectApi();

  const handleDeleteProject = useCallback(
    async (id: number, name: string) => {
      const confirmed = await confirm({
        title: "Eliminar Propiedad",
        message: `¿Estás seguro de que deseas eliminar la propiedad?"${name}"?`,
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        confirmClassName: "bg-red-600 hover:bg-red-700 disabled:opacity-50",
      });

      if (!confirmed) return;

      const success = await submitUserProject(id, "delete");

      if (success) {
        showAlert({
          type: "success",
          message: `Propiedad "${name}" eliminada exitosamente.`,
        });

        refreshMyProjects();
      } else {
        showAlert({
          type: "error",
          message: `Error al eliminar la propiedad "${name}".`,
        });
      }
    },
    [confirm, submitUserProject, refreshMyProjects, showAlert]
  );

  return (
    <>
      <div className="min-h-screen pt-20 pb-16 px-6 sm:px-12 flex flex-col gap-6">
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
          onDelete={handleDeleteProject}
          statusFilter={statusFilter}
        />
      </div>
    </>
  );
}
