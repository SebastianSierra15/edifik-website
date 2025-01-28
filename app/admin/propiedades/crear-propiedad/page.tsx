"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLocations from "@/app/hooks/projects/Metadata/location/useLocations";
import useBasicMetadata from "@/app/hooks/projects/Metadata/useBasicMetadata";
import useImageTypes from "@/app/hooks/projects/Metadata/imageTypes/useImageTypes";
import { useUploadImages } from "@/app/hooks/s3/useUploadImagesS3";
import { useCreateProject } from "@/app/hooks/projects/useProjectApi";
import { useInsertProjectMedia } from "@/app/hooks/projects/Metadata/projectMedia/useInsertProjectMedia";
import ProgressBar from "@/app/ui/projects/createEditProject/progressBar";
import BasicProjectForm from "@/app/ui/projects/createEditProject/basicProjectForm";
import LocationProjectForm from "@/app/ui/projects/createEditProject/locationProjectForm";
import FeaturesProjectForm from "@/app/ui/projects/createEditProject/featuresProjectForm";
import DetailsProjectForm from "@/app/ui/projects/createEditProject/detailsProjectForm";
import ImagesProjectForm from "@/app/ui/projects/createEditProject/imagesProjectForm";
import Loader from "@/app/ui/loader";
import ModalConfirmation from "@/app/ui/modals/modalConfirmation";
import CreateProjectSkeleton from "@/app/ui/projects/createEditProject/skeleton/createProjectSkeleton";
import { ProjectData, Media } from "@/lib/definitios";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function CreatePropertyPage() {
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();

  const { metadata } = useBasicMetadata();
  const { imagesTypes } = useImageTypes();
  const { createProject } = useCreateProject();
  const { uploadImages } = useUploadImages();
  const { insertProjectMedia } = useInsertProjectMedia();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaToSubmit, setMediaToSubmit] = useState<Media[] | null>(null);

  const handleUpdateProject = (updatedData: Partial<ProjectData>) => {
    setProjectData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = (data: Partial<ProjectData>) => {
    handleUpdateProject(data);
    handleNextStep();
  };

  const handleFinalSubmit = async (media: Media[]) => {
    try {
      setLoading(true);

      const projectId = await createProject(projectData);
      if (!projectId) {
        console.error("No se pudo crear la propiedad.");
        return;
      }

      const result = await uploadImages(
        projectId,
        media,
        projectData.propertyType?.name ?? "default"
      );

      if (result) {
        await insertProjectMedia(result);
      } else {
        throw new Error("Error al subir las imágenes.");
      }
    } catch (err) {
      console.error("Error durante el proceso:", err);
    } finally {
      setLoading(false);
      router.push("/admin/propiedades");
    }
  };

  const handleOpenModal = (media: Media[]) => {
    setMediaToSubmit(media);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setMediaToSubmit(null);
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    if (mediaToSubmit) {
      handleFinalSubmit(mediaToSubmit);
    }
    handleCloseModal();
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <Loader message="Subiendo propiedad, por favor espera..." />}
      <h1 className="mb-10 mt-24 text-center text-3xl font-semibold text-premium-primary lg:mt-20 dark:text-premium-primaryLight">
        Agregar Propiedad
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      {!metadata || !locations ? (
        <CreateProjectSkeleton />
      ) : (
        <div className="mt-6">
          {currentStep === 0 && metadata && (
            <BasicProjectForm
              formData={projectData || {}}
              onChange={handleUpdateProject}
              onSubmit={handleSubmit}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              propertyTypes={metadata.propertyTypes}
              currentStep={currentStep}
              totalSteps={totalSteps}
              isProperty={true}
            />
          )}

          {currentStep === 1 && (
            <LocationProjectForm
              formData={projectData || {}}
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

          {currentStep === 2 && metadata && (
            <div>
              <FeaturesProjectForm
                formData={projectData || {}}
                onChange={handleUpdateProject}
                onSubmit={handleSubmit}
                onPrevious={handlePreviousStep}
                onNext={handleNextStep}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </div>
          )}

          {currentStep === 3 && metadata && (
            <div>
              <DetailsProjectForm
                formData={projectData || {}}
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
            </div>
          )}

          {currentStep === 4 && (
            <div>
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
            </div>
          )}
        </div>
      )}

      <ModalConfirmation
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
        title="Confirmar Acción"
        message={"¿Estás seguro de que quieres subir esta propiedad?"}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-premium-secondary px-4 py-2 text-white transition-colors hover:bg-premium-secondaryLight dark:bg-premium-secondaryDark dark:hover:bg-premium-secondaryLight"
          onClick={() => router.push("/admin/propiedades")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
