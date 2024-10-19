"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/ui/properties/createProperty/progressBar";
import useColombianLocations from "@/app/hooks/useColombianLocations";
import basicPropertyForm from "@/app/ui/properties/createProperty/basicPropertyForm";

export default function CreatePropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mt-24 lg:mt-20 text-3xl text-center font-semibold mb-10 text-primary dark:text-primaryLight">
        Agregar Propiedad
      </h1>

      <div className="mb-10 text-center mx-auto">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6">
        {currentStep === 0 && (
          <div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-center text-textPrimary dark:text-textSecondary">
              Ubicación
            </h2>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-center text-textPrimary dark:text-textSecondary">
              Características
            </h2>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-center text-textPrimary dark:text-textSecondary">
              Detalles
            </h2>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-center text-textPrimary dark:text-textSecondary">
              Imágenes
            </h2>
          </div>
        )}
      </div>

      {/* Contenedor de botones */}
      <div className="mt-6 flex justify-between">
        {currentStep > 0 && (
          <button
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondaryLight dark:bg-secondaryDark dark:hover:bg-secondaryLight"
            onClick={handlePreviousStep}
          >
            Anterior
          </button>
        )}
        <div className="flex-grow"></div>
        {currentStep < 4 && (
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryLight dark:bg-primaryDark dark:hover:bg-primaryLight"
            onClick={handleNextStep}
          >
            Siguiente
          </button>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondaryLight dark:bg-secondaryDark dark:hover:bg-secondaryLight"
          onClick={() => router.push("/admin/propiedades")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
