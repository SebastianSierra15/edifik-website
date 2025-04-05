"use client";

import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectData, Media } from "@/lib/definitios";
import useLocations from "@/app/hooks/projects/metadata/location/useLocations";
import useBasicMetadata from "@/app/hooks/projects/metadata/useBasicMetadata";
import useImageTypes from "@/app/hooks/projects/metadata/imageTypes/useImageTypes";
import useDeleteProject from "@/app/hooks/projects/useDeleteProject";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import { useS3ImagesApi } from "@/app/hooks/s3/useS3ImagesApi";
import { useProjectApi } from "@/app/hooks/projects/useProjectApi";
import { useProjectMediaApi } from "@/app/hooks/projects/metadata/projectMedia/useProjectMediaApi";
import ProgressBar from "@/app/ui/admin/projects/createEditProject/progressBar";
import BasicProjectForm from "@/app/ui/admin/projects/createEditProject/basicProjectForm";
import LocationProjectForm from "@/app/ui/admin/projects/createEditProject/locationProjectForm";
import FeaturesProjectForm from "@/app/ui/admin/projects/createEditProject/featuresProjectForm";
import DetailsProjectForm from "@/app/ui/admin/projects/createEditProject/detailsProjectForm";
import ImagesProjectForm from "@/app/ui/admin/projects/createEditProject/imagesProjectForm";
import ModalConfirmation from "@/app/ui/modals/admin/modalConfirmation";
import CreateProjectSkeleton from "@/app/ui/skeletons/admin/createProjectSkeleton";
import Loader from "@/app/ui/loader";

interface ProjectFormProps {
  isEdit: boolean;
  isProperty: boolean;
  projectId?: number;
  hasPermission?: boolean;
}

export default function ProjectForm({
  isEdit,
  isProperty,
  projectId,
  hasPermission,
}: ProjectFormProps) {
  const projectQuery = isEdit
    ? useProjectById(projectId, isProperty)
    : { project: null, loading: false };
  const { project, loading: loadingProject } = projectQuery;

  const [projectData, setProjectData] = useState<Partial<ProjectData>>(
    isEdit ? {} : { projectType: { id: 1, name: "Sobre Planos" }, media: [] }
  );

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes } = useImageTypes();
  const { submitProject } = useProjectApi();
  const { deleteProject } = useDeleteProject();
  const { uploadImages, deleteImages } = useS3ImagesApi();
  const { insertProjectMedia, updateProjectMedia, deleteProjectMedia } =
    useProjectMediaApi();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaToSubmit, setMediaToSubmit] = useState<Media[] | null>(null);
  const [mapAddress, _setMapAddress] = useState(isEdit ? "Ubicación" : "");
  const mapAddressRef = useRef(mapAddress);

  const setMapAddress = (value: string) => {
    mapAddressRef.current = value;
    _setMapAddress(value);
  };

  useEffect(() => {
    if (isEdit && project && Object.keys(project).length > 0) {
      setProjectData((prev) => ({
        ...prev,
        ...project,
      }));

      setMapAddress(project.address || "");
    }
  }, [isEdit, project]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const handleUpdateProject = useCallback(
    (updatedData: Partial<ProjectData>) => {
      setProjectData((prevData) => {
        const newData = structuredClone({ ...prevData, ...updatedData });
        return newData;
      });
    },
    []
  );

  const handleNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(
    (data: Partial<ProjectData>) => {
      handleUpdateProject(data);
      handleNextStep();
    },
    [handleUpdateProject, handleNextStep]
  );

  const handleFinalSubmit = async (media: Media[]) => {
    try {
      setLoading(true);

      const finalProjectData = { ...projectData, media };

      const projectId = await createOrUpdateProject(finalProjectData);
      if (!projectId) {
        console.error("❌ No se pudo obtener un ID de proyecto válido.");
        return;
      }

      if (isEdit) {
        await handleEditMedia(projectId, media);
      } else {
        await handleNewMedia(projectId, media);
      }

      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "success",
          message: isEdit
            ? "Proyecto editado exitosamente."
            : "Proyecto creado exitosamente.",
        })
      );
    } catch (err) {
      console.error("❌ Error durante el proceso:", err);
      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "error",
          message: "Hubo un problema al procesar el proyecto.",
        })
      );
    } finally {
      setLoading(false);
      router.push(isProperty ? "/admin/propiedades" : "/admin/proyectos");
    }
  };

  const createOrUpdateProject = async (projectData: Partial<ProjectData>) => {
    const result = await submitProject(projectData, isEdit ? "edit" : "create");

    if (isEdit) {
      if (!result) {
        console.error("❌ Error al editar el proyecto.");
        sessionStorage.setItem(
          "projectMessage",
          JSON.stringify({
            type: "error",
            message: "Error al editar el proyecto.",
          })
        );
        return null;
      }
      return projectData.id ?? null;
    } else {
      if (typeof result === "number") return result;

      console.error("❌ Error al crear el proyecto.");
      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "error",
          message: "Error al crear el proyecto.",
        })
      );
      return null;
    }
  };

  const handleEditMedia = async (projectId: number, media: Media[]) => {
    const existingMedia = media.filter((m) => typeof m.file === "string");
    const newMedia = media.filter((m) => m.file instanceof File);

    const mediaUrls = existingMedia.map((m) => m.file as string);
    const previousMediaUrls = projectData.projectMedia?.map((m) => m.url) || [];

    await deleteUnusedImages(previousMediaUrls, mediaUrls);

    if (newMedia.length > 0) {
      await uploadAndInsertMedia(projectId, newMedia);
    }

    await updateExistingMedia(media);
  };

  const handleNewMedia = async (projectId: number, media: Media[]) => {
    await uploadAndInsertMedia(projectId, media);
  };

  const deleteUnusedImages = async (
    previousUrls: string[],
    currentUrls: string[]
  ) => {
    const imagesToDelete = previousUrls.filter(
      (url) => !currentUrls.includes(url)
    );

    if (imagesToDelete.length > 0) {
      await deleteImages(imagesToDelete);

      const mediaIdsToDelete =
        projectData.projectMedia
          ?.filter((m) => imagesToDelete.includes(m.url))
          .map((m) => m.id)
          .filter((id): id is number => id !== undefined) || [];

      if (mediaIdsToDelete.length > 0) {
        await deleteProjectMedia(mediaIdsToDelete);
      }
    }
  };

  const uploadAndInsertMedia = async (projectId: number, media: Media[]) => {
    const uploadResult = await uploadImages(
      projectId,
      media,
      projectData.propertyType?.name ?? "default"
    );

    if (!uploadResult || uploadResult.length === 0) {
      console.error(
        "❌ No se pudieron subir imágenes. Eliminando el proyecto..."
      );
      await deleteProject(projectId);
      throw new Error("Error al subir las imágenes. Proyecto eliminado.");
    }

    try {
      await insertProjectMedia(uploadResult);
    } catch (error) {
      console.error(
        "❌ Error al insertar imágenes en la base de datos. Eliminando el proyecto..."
      );
      await deleteProject(projectId);
      throw new Error(
        "Error al insertar imágenes en la BD. Proyecto eliminado."
      );
    }
  };

  const updateExistingMedia = async (media: Media[]): Promise<void> => {
    const mediaToUpdate =
      projectData.projectMedia
        ?.map((original) => {
          const updated = media.find(
            (m) => typeof m.file === "string" && m.file === original.url
          );

          if (
            updated &&
            (updated.tag.trim() !== original.tag.trim() ||
              (updated.description?.trim() || "") !==
                (original.description?.trim() || ""))
          ) {
            return {
              id: original.id!,
              tag: updated.tag,
              description: updated.description ?? "",
            };
          }
          return null;
        })
        .filter(
          (item): item is { id: number; tag: string; description: string } =>
            item !== null
        ) || [];

    if (mediaToUpdate.length > 0) {
      await updateProjectMedia(mediaToUpdate);
    }
  };

  const handleOpenModal = (media: Media[], validateFields: () => boolean) => {
    setProjectData((prevData) => ({
      ...prevData,
      media,
    }));

    setTimeout(() => {
      if (!validateFields()) {
        console.error("🚨 Validación fallida antes de abrir el modal.");
        return;
      }
      setMediaToSubmit(media);
      setIsModalOpen(true);
    }, 100);
  };

  const handleCloseModal = () => {
    setMediaToSubmit(null);
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    if (!mediaToSubmit) return;

    handleCloseModal();

    setTimeout(() => {
      setLoading(true);
    }, 100);

    try {
      await handleFinalSubmit(mediaToSubmit);
    } catch (error) {
      console.error("Error en la confirmación de envío:", error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const currentForm = useMemo(() => {
    if (!metadata || !locations || (loadingProject && isEdit)) {
      return <CreateProjectSkeleton />;
    }

    return (
      <>
        {currentStep === 0 && (
          <BasicProjectForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            propertyTypes={metadata.propertyTypes}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isProperty={isProperty}
            isEdit={isEdit}
            hasPermission={hasPermission}
          />
        )}

        {currentStep === 1 && (
          <LocationProjectForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            departaments={locations.departaments}
            cities={locations.cities}
            mapAddress={mapAddressRef.current}
            setMapAddress={setMapAddress}
          />
        )}

        {currentStep === 2 && (
          <FeaturesProjectForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentStep === 3 && (
          <DetailsProjectForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            commonAreas={metadata.commonAreas}
            nearbyServices={metadata.nearbyServices}
            housingTypes={metadata.housingTypes}
          />
        )}

        {currentStep === 4 && (
          <ImagesProjectForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleOpenModal}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            imagesTypes={imagesTypes}
          />
        )}
      </>
    );
  }, [currentStep, metadata, locations, projectData]);

  return (
    <div className="container mx-auto p-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader size={50} />
        </div>
      )}

      <h1 className="mb-10 mt-24 text-center text-3xl font-semibold text-premium-primary lg:mt-20 dark:text-premium-primaryLight">
        {isEdit ? "Editar " : "Agregar "}
        {isProperty ? "Propiedad" : "Proyecto"}
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6 mx-auto max-w-3xl">{currentForm}</div>

      <ModalConfirmation
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
        title="Confirmar Acción"
        message={
          isEdit
            ? "¿Deseas guardar los cambios?"
            : "¿Estás seguro de que quieres subir este proyecto?"
        }
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-premium-secondary px-4 py-2 text-white transition-colors hover:bg-premium-secondaryLight dark:bg-premium-secondaryDark dark:hover:bg-premium-secondaryLight"
          onClick={() =>
            router.push(isProperty ? "/admin/propiedades" : "/admin/proyectos")
          }
        >
          Volver
        </button>
      </div>
    </div>
  );
}
