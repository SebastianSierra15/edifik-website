"use client";

import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectFormData, Media } from "@/src/interfaces";
import {
  useLocations,
  useBasicMetadata,
  useImageTypes,
  useDeleteProject,
  useProjectApi,
  useProjectById,
  useProjectMediaApi,
} from "@/src/hooks/projects";
import { useS3ImagesApi } from "@/src/hooks/s3";
import { useClientConfirmation, useLoading } from "@/src/providers";
import { CreateProjectSkeleton } from "@/src/components/admin";
import { ProgressBar } from "@/src/components/user";
import { BasicPropertyForm } from "./BasicPropertyForm";
import { LocationPropertyForm } from "./LocationPropertyForm";
import { FeaturesPropertyForm } from "./FeaturesPropertyForm";
import { DetailsPropertyForm } from "./DetailsPropertyForm";
import { ImagesPropertyForm } from "./ImagesPropertyForm";

interface PropertyFormProps {
  isEdit: boolean;
  projectId?: number;
  hasPermission?: boolean;
}

export function PropertyForm({
  isEdit,
  projectId,
  hasPermission,
}: PropertyFormProps) {
  const projectQuery = useProjectById(projectId, false, true);
  const project = isEdit ? projectQuery.project : null;
  const loadingProject = isEdit ? projectQuery.loading : false;
  const error = isEdit ? projectQuery.error : null;

  const [projectData, setProjectData] = useState<Partial<ProjectFormData>>(
    isEdit ? {} : { projectType: { id: 2, name: "Venta" }, media: [] }
  );

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();
  const confirm = useClientConfirmation();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes } = useImageTypes();
  const { submitProject } = useProjectApi();
  const { deleteProject } = useDeleteProject();
  const { uploadImages, deleteImages } = useS3ImagesApi();
  const { insertProjectMedia, updateProjectMedia, deleteProjectMedia } =
    useProjectMediaApi();
  const { showLoader, hideLoader, isLoading } = useLoading();
  const [mapAddress, _setMapAddress] = useState(isEdit ? "UbicaciÇün" : "");
  const mapAddressRef = useRef(mapAddress);

  const setMapAddress = (value: string) => {
    mapAddressRef.current = value;
    _setMapAddress(value);
  };

  useEffect(() => {
    if (!isEdit || !error) return;
    if (error === "No autorizado" || error === "No autenticado") {
      router.replace("/unauthorized");
    }
  }, [isEdit, error, router]);

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
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleUpdateProject = useCallback(
    (updatedData: Partial<ProjectFormData>) => {
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
    (data: Partial<ProjectFormData>) => {
      handleUpdateProject(data);
      handleNextStep();
    },
    [handleUpdateProject, handleNextStep]
  );

  const handleFinalSubmit = async (media: Media[]) => {
    try {
      showLoader();

      const finalProjectData = { ...projectData, media };

      const projectId = await createOrUpdateProject(finalProjectData);
      if (!projectId) {
        console.error("No se pudo obtener un ID de propiedad válido.");
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
            ? "Propiedad editada exitosamente."
            : "Propiedad creada exitosamente.",
        })
      );
    } catch (err) {
      console.error("Error general al crear proyecto:", err);

      console.error("Error durante el proceso:", err);
      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "error",
          message: "Hubo un problema al procesar la propiedad.",
        })
      );
    } finally {
      hideLoader();
      router.push("/usuario/mis-propiedades");
    }
  };

  const createOrUpdateProject = async (
    projectData: Partial<ProjectFormData>
  ) => {
    const result = await submitProject(projectData, isEdit ? "edit" : "create");

    if (isEdit) {
      if (!result) {
        console.error("Error al editar la propiedad.");
        sessionStorage.setItem(
          "projectMessage",
          JSON.stringify({
            type: "error",
            message: "Error al editar la propiedad.",
          })
        );
        return null;
      }
      return projectData.id ?? null;
    } else {
      if (typeof result === "number") return result;

      console.error("Error al crear la propiedad.");
      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "error",
          message: "Error al crear la propiedad.",
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
        "No se pudieron subir imágenes. Eliminando la propiedad..."
      );
      await deleteProject(projectId);
      throw new Error("Error al subir las imágenes. Propiedad eliminada.");
    }

    try {
      await insertProjectMedia(uploadResult);
    } catch (error) {
      console.error(
        "Error al insertar imágenes en la base de datos. Eliminando la propiedad..."
      );
      await deleteProject(projectId);
      throw new Error(
        "Error al insertar imágenes en la BD. Propiedad eliminada."
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
    setTimeout(async () => {
      if (!validateFields()) {
        console.error("Validación fallida antes de abrir el modal.");
        return;
      }

      const confirmed = await confirm({
        title: "Confirmar Acción",
        message: isEdit
          ? "¿Deseas guardar los cambios?"
          : "¿Estás seguro de que quieres subir esta propiedad?",
        confirmLabel: "Confirmar",
        cancelLabel: "Cancelar",
      });

      if (!confirmed) return;

      setTimeout(() => {
        showLoader();
      }, 100);

      try {
        await handleFinalSubmit(media);
      } catch (error) {
        console.error("Error en la confirmación de envío:", error);
      } finally {
        hideLoader();
      }
    }, 100);
  };

  const currentForm = useMemo(() => {
    if (!metadata || !locations || (loadingProject && isEdit)) {
      return <CreateProjectSkeleton />;
    }

    return (
      <>
        {currentStep === 0 && (
          <BasicPropertyForm
            formData={projectData}
            onChange={handleUpdateProject}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            propertyTypes={metadata.propertyTypes}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isEdit={isEdit}
            hasPermission={hasPermission}
          />
        )}

        {currentStep === 1 && (
          <LocationPropertyForm
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
          <FeaturesPropertyForm
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
          <DetailsPropertyForm
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
          <ImagesPropertyForm
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
    <div className="bg-client-backgroundLight w-full p-6">
      <h1 className="mb-10 mt-24 text-center text-3xl font-semibold text-client-text lg:mt-20">
        {isEdit ? "Editar " : "Agregar "}
        Propiedad
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6 mx-auto max-w-3xl">{currentForm}</div>
      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-client-background px-4 py-2 text-white transition-colors hover:bg-client-backgroundAlt"
          onClick={() => router.push("/usuario/mis-propiedades")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
