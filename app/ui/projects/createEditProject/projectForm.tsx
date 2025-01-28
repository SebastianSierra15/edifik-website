"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectData, Media } from "@/lib/definitios";
import useLocations from "@/app/hooks/projects/Metadata/location/useLocations";
import useBasicMetadata from "@/app/hooks/projects/Metadata/useBasicMetadata";
import useImageTypes from "@/app/hooks/projects/Metadata/imageTypes/useImageTypes";
import { useProjectByName } from "@/app/hooks/projects/useProjectByName";
import { useUploadImagesS3 } from "@/app/hooks/s3/useUploadImagesS3";
import { useDeleteImagesS3 } from "@/app/hooks/s3/useDeleteImagesS3";
import { useProjectApi } from "@/app/hooks/projects/useProjectApi";
import { useProjectMediaApi } from "@/app/hooks/projects/Metadata/projectMedia/useProjectMediaApi";
import ProgressBar from "@/app/ui/projects/createEditProject/progressBar";
import BasicProjectForm from "@/app/ui/projects/createEditProject/basicProjectForm";
import LocationProjectForm from "@/app/ui/projects/createEditProject/locationProjectForm";
import FeaturesProjectForm from "@/app/ui/projects/createEditProject/featuresProjectForm";
import DetailsProjectForm from "@/app/ui/projects/createEditProject/detailsProjectForm";
import ImagesProjectForm from "@/app/ui/projects/createEditProject/imagesProjectForm";
import ModalConfirmation from "@/app/ui/modals/modalConfirmation";
import CreateProjectSkeleton from "@/app/ui/projects/createEditProject/skeleton/createProjectSkeleton";
import Loader from "@/app/ui/loader";

interface ProjectFormProps {
  isEdit: boolean;
  isProperty: boolean;
  projectName?: string;
}

export default function ProjectForm({
  isEdit,
  isProperty,
  projectName,
}: ProjectFormProps) {
  const { project, loading: loadingProject } = useProjectByName(
    projectName || ""
  );

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
  const { uploadImages } = useUploadImagesS3();
  const { deleteImages } = useDeleteImagesS3();
  const { insertProjectMedia, updateProjectMedia, deleteProjectMedia } =
    useProjectMediaApi();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaToSubmit, setMediaToSubmit] = useState<Media[] | null>(null);

  useEffect(() => {
    if (isEdit && project && Object.keys(project).length > 0) {
      setProjectData((prev) => ({
        ...prev,
        ...project,
      }));
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

      const result = await submitProject(
        finalProjectData,
        isEdit ? "edit" : "create"
      );

      let projectId: number | null = null;

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
          return;
        }
        projectId = projectData.id ?? null;
      } else {
        if (typeof result === "number") {
          projectId = result;
        } else {
          console.error("❌ Error al crear el proyecto.");
          sessionStorage.setItem(
            "projectMessage",
            JSON.stringify({
              type: "error",
              message: "Error al crear el proyecto.",
            })
          );
          return;
        }
      }

      if (!projectId) {
        console.error("❌ ID del proyecto inválido.");
        sessionStorage.setItem(
          "projectMessage",
          JSON.stringify({ type: "error", message: "ID de proyecto inválido." })
        );
        return;
      }

      if (isEdit) {
        const existingMedia = media.filter((m) => typeof m.file === "string");
        const newMedia = media.filter((m) => m.file instanceof File);
        const mediaUrls = existingMedia.map((m) => m.file as string);
        const previousMediaUrls =
          projectData.projectMedia?.map((m) => m.url) || [];

        const imagesToDelete = previousMediaUrls.filter(
          (url) => !mediaUrls.includes(url)
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

        if (newMedia.length > 0) {
          const uploadResult = await uploadImages(
            projectId,
            newMedia,
            projectData.propertyType?.name ?? "default"
          );

          if (uploadResult) {
            await insertProjectMedia(uploadResult);
          } else {
            throw new Error("Error al subir las imágenes.");
          }
        }

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
              (
                item
              ): item is { id: number; tag: string; description: string } =>
                item !== null
            ) || [];

        if (mediaToUpdate.length > 0) {
          await updateProjectMedia(mediaToUpdate);
        }
      } else {
        const uploadResult = await uploadImages(
          projectId,
          media,
          projectData.propertyType?.name ?? "default"
        );

        if (uploadResult) {
          await insertProjectMedia(uploadResult);
        } else {
          throw new Error("Error al subir las imágenes.");
        }
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
      router.push("/admin/proyectos");
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
        {isEdit ? "Editar Proyecto" : "Agregar Proyecto"}
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
          onClick={() => router.push("/admin/proyectos")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
