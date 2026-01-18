"use client";

import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Media, ProjectFormData } from "@/src/interfaces";
import {
  useLocations,
  useBasicMetadata,
  useImageTypes,
  useProjectById,
  useProjectSubmission,
} from "@/src/hooks/projects";
import { useConfirmation, useLoading } from "@/src/providers";
import { ProgressBar } from "./ProgressBar";
import { BasicProjectForm } from "./BasicProjectForm";
import { LocationProjectForm } from "./LocationProjectForm";
import { FeaturesProjectForm } from "./FeaturesProjectForm";
import { DetailsProjectForm } from "./DetailsProjectForm";
import { ImagesProjectForm } from "./ImagesProjectForm";
import { CreateProjectSkeleton } from "./CreateProjectSkeleton";

interface ProjectFormProps {
  isEdit: boolean;
  isProperty: boolean;
  projectId?: number;
  hasPermission?: boolean;
}

export function ProjectForm({
  isEdit,
  isProperty,
  projectId,
  hasPermission,
}: ProjectFormProps) {
  const projectQuery = useProjectById(projectId, !isProperty, true);
  const project = isEdit ? projectQuery.project : null;
  const loadingProject = isEdit ? projectQuery.loading : false;

  const [projectData, setProjectData] = useState<ProjectFormData>(
    isEdit ? {} : { projectType: { id: 1, name: "Sobre Planos" }, media: [] }
  );

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes } = useImageTypes();
  const { submitProjectForm, isSubmitting, submissionPhase } =
    useProjectSubmission({
      isEdit,
      isProperty,
      projectData,
    });
  const { showLoader, hideLoader, setLoaderMessage } = useLoading();
  const confirm = useConfirmation();
  const [mapAddress, _setMapAddress] = useState("");
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
    if (isSubmitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSubmitting]);

  useEffect(() => {
    if (!isSubmitting) {
      hideLoader();
      setLoaderMessage(undefined);
      return;
    }

    showLoader();
    return () => hideLoader();
  }, [hideLoader, isSubmitting, setLoaderMessage, showLoader]);

  useEffect(() => {
    if (!isSubmitting) return;

    const entityLabel = isProperty ? "propiedad" : "proyecto";
    const message =
      submissionPhase === "saving-images"
        ? `Guardando imagenes de ${entityLabel}...`
        : isEdit
          ? `Editando ${entityLabel}...`
          : `Creando ${entityLabel}...`;

    setLoaderMessage(message);
  }, [isEdit, isProperty, isSubmitting, setLoaderMessage, submissionPhase]);

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
    [handleNextStep, handleUpdateProject]
  );

  const handleOpenModal = useCallback(
    (media: Media[], validateFields: () => boolean) => {
      setProjectData((prevData) => ({
        ...prevData,
        media,
      }));

      setTimeout(() => {
        if (!validateFields()) {
          console.error("🚨 Validación fallida antes de abrir el modal.");
          return;
        }
        confirm({
          title: "Confirmar Accion",
          message: isEdit
            ? "Deseas guardar los cambios?"
            : "Estas seguro de que quieres subir este proyecto?",
          action: isEdit ? "edit" : "create",
        }).then((confirmed) => {
          if (!confirmed) return;

          submitProjectForm(media).then(({ redirectPath }) => {
            router.push(redirectPath);
          });
        });
      }, 100);
    },
    [confirm, isEdit, router, submitProjectForm]
  );

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
            isProperty={isProperty}
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
            isProperty={isProperty}
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
            isProperty={isProperty}
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
            isProperty={isProperty}
          />
        )}
      </>
    );
  }, [
    currentStep,
    handleNextStep,
    handleOpenModal,
    handlePreviousStep,
    handleSubmit,
    handleUpdateProject,
    hasPermission,
    imagesTypes,
    isEdit,
    isProperty,
    loadingProject,
    locations,
    metadata,
    projectData,
  ]);

  return (
    <div className="container mx-auto px-6 pb-6">
      <h1 className="mb-10 text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight">
        {isEdit ? "Editar " : "Agregar "}
        {isProperty ? "Propiedad" : "Proyecto"}
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6 mx-auto max-w-3xl">{currentForm}</div>

      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-premium-secondary px-4 py-2 text-white transition-colors hover:bg-premium-secondaryLight dark:bg-premium-secondaryDark dark:hover:bg-premium-secondaryLight"
          onClick={() =>
            router.push(
              isProperty ? "/admin/inmobiliaria" : "/admin/proyectos"
            )
          }
        >
          Volver
        </button>
      </div>
    </div>
  );
}

