"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import { Plus, Search, ShoppingCart, KeySquare } from "lucide-react";
import { useGetProjects } from "@/app/hooks/projects/useGetProjects";
import { useProjectApi } from "@/app/hooks/projects/useProjectApi";
import { useOwner } from "@/app/hooks/projects/owner/useOwner";
import FilterMapControls from "@/app/ui/admin/projects/filter/filterMapControls";
import Alert from "@/app/ui/alert";
import ProjectSkeletonList from "../../skeletons/projectSkeletonList";

const MapToggleButton = dynamic(() => import("./filter/mapToggleButton"), {
  ssr: false,
});
const ProjectsContainer = dynamic(
  () => import("@/app/ui/admin/projects/projectsContainer"),
  {
    loading: () => <ProjectSkeletonList count={8} />,
    ssr: false,
  }
);
const OwnerModal = dynamic(() => import("./project/ownerModal"), {
  ssr: false,
});
const ModalConfirmation = dynamic(
  () => import("@/app/ui/modals/admin/modalConfirmation"),
  { ssr: false }
);

export default function ProjectManager({
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
    area: [1],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { submitProject, isProcessing } = useProjectApi();
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const startOwnerFetch = performance.now(); // Inicia medición del tiempo de fetch de propietario

  const { owner, refetchUser } = useOwner(selectedOwner ?? "");

  const endOwnerFetch = performance.now(); // Finaliza medición del tiempo de fetch de propietario
  console.log(
    `⏱️ Tiempo total de fetch de propietario en ProjectManager: ${(endOwnerFetch - startOwnerFetch).toFixed(2)}ms`
  );

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

  const startProjectsFetch = performance.now(); // Inicia medición del tiempo de fetch de proyectos

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

  const endProjectsFetch = performance.now(); // Finaliza medición del tiempo de fetch de proyectos
  console.log(
    `⏱️ Tiempo total de fetch de proyectos en ProjectManager: ${(endProjectsFetch - startProjectsFetch).toFixed(2)}ms`
  );

  useEffect(() => {
    if (selectedOwner) {
      refetchUser();
    }
  }, [selectedOwner]);

  useEffect(() => {
    console.log("🔄 selectedButtons actualizado:", selectedButtons);
  }, [selectedButtons]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const startRender = performance.now();
      return () => {
        const endRender = performance.now();
        console.log(
          `⏱️ Tiempo de renderizado en UI: ${(endRender - startRender).toFixed(2)}ms`
        );
      };
    }
  }, []);

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

  const handleOpenModal = useCallback((id: number, name: string) => {
    setSelectedProject({ id, name });
    setIsModalOpen(true);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (!selectedProject) return;

    const success = await submitProject(selectedProject.id, "delete");

    if (success) {
      setAlertMessage({
        type: "success",
        message: `${isProperty ? "Propiedad" : "Proyecto"} "${selectedProject.name}" eliminado exitosamente.`,
      });

      refreshProjects();
    } else {
      setAlertMessage({
        type: "error",
        message: `Error al eliminar ${isProperty ? "la propiedad" : "el proyecto"} "${selectedProject.name}".`,
      });
    }

    setIsModalOpen(false);
    setSelectedProject(null);
  }, [selectedProject, submitProject, refreshProjects, isProperty]);

  const handleShowUserDetails = (email: string) => {
    setSelectedOwner(email);
    refetchUser();
    setIsOwnerModalOpen(true);
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
          title={isProperty ? "Eliminar Propiedad" : "Eliminar Proyecto"}
          message={`¿Estás seguro de que deseas eliminar ${isProperty ? "la propiedad" : "el proyecto"} "${selectedProject?.name}"?`}
          confirmLabel={isProcessing ? "Eliminando..." : "Eliminar"}
          cancelLabel="Cancelar"
          confirmClassName="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        />
      )}

      <div className="bg-premium-backgroundDark px-6 pb-2 pt-6 dark:bg-premium-backgroundLight">
        <h1
          className={clsx(
            "mt-24 text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight",
            { "mb-10": isProperty, "mb-16": !isProperty }
          )}
        >
          Gestión de {isProperty ? "Propiedades" : "Proyectos"}
        </h1>

        {projectTypeId != 1 && (
          <div className="mb-6 flex items-center justify-center gap-4">
            {[
              { id: 2, label: "Venta", icon: <ShoppingCart /> },
              { id: 3, label: "Arriendo", icon: <KeySquare /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setProjectTypeId && setProjectTypeId(id)}
                className={`flex items-center gap-2 rounded-lg px-6 py-2 shadow-md transition-colors ${
                  projectTypeId === id
                    ? "bg-premium-primary text-white hover:bg-premium-primaryDark dark:bg-premium-primaryLight"
                    : "bg-premium-backgroundLight text-premium-primary hover:bg-premium-backgroundDark dark:bg-premium-background dark:text-premium-primaryLight dark:hover:bg-premium-backgroundLight"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mb-10 flex flex-col items-center gap-8 sm:px-6 md:flex-row md:justify-between">
          <div className="relative w-full">
            <input
              name="searchProject"
              type="text"
              placeholder={
                isProperty ? "Buscar propiedades..." : "Buscar proyectos..."
              }
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 pl-10 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-background dark:text-premium-textPrimary"
            />
            <Search className="absolute left-3 top-2 text-premium-textPlaceholder dark:text-premium-textSecondary" />
          </div>

          <Link
            href={
              isProperty
                ? "/admin/propiedades/crear-propiedad"
                : "/admin/proyectos/crear-proyecto"
            }
            className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            <Plus />
            <span>{isProperty ? "Nueva Propiedad" : "Nuevo Proyecto"}</span>
          </Link>
        </div>
      </div>

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
        onDelete={handleOpenModal}
        permission={permission}
        onShowUser={handleShowUserDetails}
      />

      <MapToggleButton showMap={showMap} setShowMap={setShowMap} />

      <OwnerModal
        show={isOwnerModalOpen}
        flag={!!owner}
        onClose={() => {
          setIsOwnerModalOpen(false);
          setSelectedOwner(null);
        }}
        onSubmit={(e) => e.preventDefault()}
        handleChange={() => {}}
        user={
          owner || {
            id: 0,
            username: "",
            names: "",
            lastnames: "",
            email: "",
            phoneNumber: "",
          }
        }
      />
    </div>
  );
}
