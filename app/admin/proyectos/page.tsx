"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useGetProjects } from "@/app/hooks/projects/useGetProjects";
import { useProjectApi } from "@/app/hooks/projects/useProjectApi";
import ProjectsContainer from "@/app/ui/projects/projectsContainer";
import FilterMapControls from "@/app/ui/projects/filter/filterMapControls";
import ModalConfirmation from "@/app/ui/modals/modalConfirmation";
import Alert from "@/app/ui/alert";

const MapToggleButton = dynamic(
  () => import("../../ui/projects/filter/mapToggleButton"),
  {
    ssr: false,
  }
);

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const userPermissions = session?.user?.permissions || [];
  const permission = userPermissions.some(
    (perm) => perm.name === "Gestionar proyectos"
  );

  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, number[]>
  >({
    cities: [],
    propertyTypes: [],
    housingTypes: [],
    commonAreas: [],
    nearbyServices: [],
    memberships: [],
    bedrooms: [0],
    bathrooms: [0],
    lobbies: [0],
    area: [1],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { submitProject, isProcessing } = useProjectApi();

  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [areaRange, setAreaRange] = useState({ min: 0, max: 0 });

  const [entriesPerPage] = useState(16);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    isLoading,
    refreshProjects,
  } = useGetProjects({
    entriesPerPage,
    selectedButtons,
    currentProjects: [],
    projectTypeId: 1,
    bounds: showMap ? bounds : null,
    showMap: showMap,
  });

  const memoizedProjects = useMemo(() => projects, [projects]);

  useEffect(() => {
    const message = sessionStorage.getItem("projectMessage");
    if (message) {
      setAlertMessage(JSON.parse(message));
      sessionStorage.removeItem("projectMessage");
    }

    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  useEffect(() => {
    if (!showMap) {
      setBounds(null);
    }
  }, [showMap]);

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
        message: `Proyecto "${selectedProject.name}" eliminado exitosamente.`,
      });

      refreshProjects();
    } else {
      setAlertMessage({
        type: "error",
        message: `Error al eliminar el proyecto "${selectedProject.name}".`,
      });
    }

    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="relative">
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
          title="Eliminar Proyecto"
          message={`¿Estás seguro de que deseas eliminar el proyecto "${selectedProject?.name}"?`}
          confirmLabel={isProcessing ? "Eliminando..." : "Eliminar"}
          cancelLabel="Cancelar"
          confirmClassName="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        />
      )}

      <div className="bg-premium-backgroundDark px-6 pb-2 pt-6 dark:bg-premium-backgroundLight">
        <h1 className="mb-16 mt-24 text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight">
          Gestión de Proyectos
        </h1>
        <div className="mb-10 flex flex-col items-center gap-8 sm:px-6 md:flex-row md:justify-between">
          <div className="relative w-full">
            <input
              name="searchProject"
              type="text"
              placeholder="Buscar proyectos..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 pl-10 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-background dark:text-premium-textPrimary"
            />
            <Search className="absolute left-3 top-3 text-premium-textPlaceholder dark:text-premium-textSecondary" />
          </div>

          <Link
            href="/admin/proyectos/crear-proyecto"
            className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            <Plus />
            <span>Nuevo Proyecto</span>
          </Link>
        </div>
      </div>

      <hr className="w-full border-premium-borderColor dark:border-premium-borderColorHover" />

      <div
        className={clsx(
          "bg-premium-backgroundDark px-6 pt-2 dark:bg-premium-backgroundLight pb-14",
          showMap && "pb-7"
        )}
      >
        <FilterMapControls
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          showMap={showMap}
          setShowMap={setShowMap}
        />
      </div>

      <ProjectsContainer
        projects={memoizedProjects}
        totalEntries={totalEntries}
        isLoading={isLoading}
        fetchMoreProjects={fetchMoreProjects}
        filterOpen={filterOpen}
        showMap={showMap}
        setFilterOpen={setFilterOpen}
        priceRange={priceRange}
        areaRange={areaRange}
        selectedButtons={selectedButtons}
        setSelectedButtons={setSelectedButtons}
        isProperty={false}
        setBounds={setBounds}
        onDelete={handleOpenModal}
        permission={permission}
      />

      <MapToggleButton showMap={showMap} setShowMap={setShowMap} />
    </div>
  );
}
