"use client";

import { useState, useEffect, useCallback } from "react";
import type { LatLngBounds } from "leaflet";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { useGetProjects, useProjectApi, useOwner } from "@/src/hooks/projects";
import { useAlert, useConfirmation, useLoading } from "@/src/providers";
import { OwnerModalWrapper } from "./OwnerModalWrapper";
import { ProjectManagerHeader } from "./ProjectManagerHeader";
import { ProjectSearchAndCreate } from "./ProjectSearchAndCreate";
import { ProjectTypeToggle } from "./ProjectTypeToggle";
import { FilterMapControls } from "./filter/FilterMapControls";
import { MapToggleButton } from "./filter";
import { ProjectSkeletonList } from "./ProjectSkeletonList";

const ProjectsContainer = dynamic(
  () => import("./ProjectsContainer").then((mod) => mod.ProjectsContainer),
  {
    loading: () => <ProjectSkeletonList />,
    ssr: false,
  }
);
export function ProjectManager({
  isProperty,
  projectTypeId,
  setProjectTypeId,
}: {
  isProperty: boolean;
  projectTypeId: number;
  setProjectTypeId?: (id: number) => void;
}) {
  const { data: session } = useSession();
  const userPermissions = session?.user?.permissions || [];
  const permission = userPermissions.some(
    (perm) =>
      perm.name ===
      (isProperty ? "Gestionar propiedades" : "Gestionar proyectos")
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
    price: [],
    area: [1],
  });

  const { submitProject, isProcessing } = useProjectApi();
  const { showAlert } = useAlert();
  const confirm = useConfirmation();
  const { showLoader, hideLoader, setLoaderMessage } = useLoading();
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const { owner } = useOwner(selectedOwner ?? "");

  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [areaRange, setAreaRange] = useState({ min: 0, max: 0 });

  const [entriesPerPage] = useState(16);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

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
    projectTypeId: projectTypeId,
    bounds: showMap ? bounds : null,
    showMap: showMap,
  });

  useEffect(() => {
    if (!isLoading || showMap) {
      return;
    }

    showLoader();
    setLoaderMessage(`Cargando ${isProperty ? "propiedades" : "proyectos"}...`);

    return () => hideLoader();
  }, [
    hideLoader,
    isLoading,
    isProperty,
    setLoaderMessage,
    showLoader,
    showMap,
  ]);

  useEffect(() => {
    const message = sessionStorage.getItem("projectMessage");
    if (message) {
      showAlert(JSON.parse(message));
      sessionStorage.removeItem("projectMessage");
    }

    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
  }, []);

  useEffect(() => {
    if (!showMap) {
      setBounds(null);
    }
  }, [showMap]);

  const handleDeleteProject = useCallback(
    async (id: number, name: string) => {
      const shouldDelete = await confirm({
        title: isProperty ? "Eliminar Propiedad" : "Eliminar Proyecto",
        message: `¿Estás seguro de que deseas eliminar ${isProperty ? "la propiedad" : "el proyecto"} "${name}"?`,
        confirmLabel: isProcessing ? "Eliminando..." : "Eliminar",
        action: "delete",
      });

      if (!shouldDelete) return;

      const success = await submitProject(id, "delete");

      if (success) {
        showAlert({
          type: "success",
          message: `${isProperty ? "Propiedad" : "Proyecto"} "${name}" eliminado exitosamente.`,
        });

        refreshProjects();
      } else {
        showAlert({
          type: "error",
          message: `Error al eliminar ${isProperty ? "la propiedad" : "el proyecto"} "${name}".`,
        });
      }
    },
    [
      confirm,
      isProperty,
      isProcessing,
      refreshProjects,
      showAlert,
      submitProject,
    ]
  );

  const handleShowUserDetails = (email: string) => {
    setSelectedOwner(email);
    setIsOwnerModalOpen(true);
  };

  return (
    <>
      <ProjectManagerHeader isProperty={isProperty}>
        {projectTypeId != 1 && (
          <ProjectTypeToggle
            projectTypeId={projectTypeId}
            setProjectTypeId={setProjectTypeId}
          />
        )}
        <ProjectSearchAndCreate
          isProperty={isProperty}
          onSearch={debouncedSearch}
        />
      </ProjectManagerHeader>

      <hr className="w-full border-premium-borderColor dark:border-premium-borderColorHover" />

      <div
        className={clsx(
          "bg-premium-backgroundDark px-2 sm:px-6 md:px-20 pt-2 dark:bg-premium-backgroundLight pb-14",
          showMap && "pb-7"
        )}
      >
        <FilterMapControls
          isProperty={isProperty}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          showMap={showMap}
          setShowMap={setShowMap}
          totalEntries={totalEntries}
        />
      </div>

      <ProjectsContainer
        projects={projects}
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
        isProperty={isProperty}
        setBounds={setBounds}
        onDelete={handleDeleteProject}
        permission={permission}
        onShowUser={handleShowUserDetails}
      />

      <MapToggleButton showMap={showMap} setShowMap={setShowMap} />

      <OwnerModalWrapper
        isOpen={isOwnerModalOpen}
        owner={owner}
        onClose={() => {
          setIsOwnerModalOpen(false);
          setSelectedOwner(null);
        }}
      />
    </>
  );
}
