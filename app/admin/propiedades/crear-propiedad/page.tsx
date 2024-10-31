"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useColombianLocations from "@/app/hooks/useColombianLocations";
import useBasicMetadata from "@/app/hooks/useBasicMetadata";
import useImageTypes from "@/app/hooks/useImageTypes";
import { useUploadImages } from "@/app/hooks/useUploadImages";
import { useCreateProperty } from "@/app/hooks/useCreateProperty";
import { useInsertPropertyMedia } from "@/app/hooks/useInsertPropertyMedia";
import ProgressBar from "@/app/ui/properties/createProperty/progressBar";
import BasicPropertyForm from "@/app/ui/properties/createProperty/basicPropertyForm";
import LocationPropertyForm from "@/app/ui/properties/createProperty/locationPropertyForm";
import FeaturesPropertyForm from "@/app/ui/properties/createProperty/featuresPropertyForm";
import DetailsPropertyForm from "@/app/ui/properties/createProperty/detailsPropertyForm";
import ImagesPropertyForm from "@/app/ui/properties/createProperty/imagesPropertyForm";
import Loader from "@/app/ui/loader";
import { PropertyData } from "@/lib/definitios";

export default function CreatePropertyPage() {
  const [propertyData, setPropertyData] = useState<Partial<PropertyData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const locations = useColombianLocations();

  const { metadata, loadingMetadata, errorMetadata } = useBasicMetadata();
  const { imagesTypes } = useImageTypes();
  const { createProperty } = useCreateProperty();
  const { uploadImages, uploadStatus } = useUploadImages();
  const { insertPropertyMedia } = useInsertPropertyMedia();
  const [loading, setLoading] = useState(false);

  const handleUpdateProperty = (updatedData: Partial<PropertyData>) => {
    setPropertyData((prevData) => ({
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

  const handleSubmit = (data: Partial<PropertyData>) => {
    handleUpdateProperty(data);
    handleNextStep();
  };

  const handleFinalSubmit = async (
    images: File[][],
    imageTypes: {
      type: string;
      id: number;
      category: "imageType" | "commonArea";
    }[]
  ) => {
    try {
      setLoading(true);
      const propertyId = await createProperty(propertyData);

      if (!propertyId) {
        throw new Error("No se pudo crear la propiedad.");
      }

      const result = await uploadImages(propertyId, images, imageTypes);

      if (result) {
        const { urlsMatrix, typesArray } = result;
        await insertPropertyMedia(propertyId, urlsMatrix, typesArray);
      } else {
        throw new Error("Error al subir las imágenes.");
      }

    } catch (err) {
      console.error("Error durante el proceso:", err);
    } finally {
      router.push("/admin/propiedades");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <Loader />}
      <h1 className="mt-24 lg:mt-20 text-3xl text-center font-semibold mb-10 text-primary dark:text-primaryLight">
        Agregar Propiedad
      </h1>

      <div className="mb-10 text-center mx-auto">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6">
        {currentStep === 0 && metadata && (
          <BasicPropertyForm
            formData={propertyData || {}}
            onChange={handleUpdateProperty}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            categories={metadata.categories}
            propertyTypes={metadata.propertyTypes}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentStep === 1 && (
          <LocationPropertyForm
            formData={propertyData || {}}
            onChange={handleUpdateProperty}
            onSubmit={handleSubmit}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            locations={locations}
          />
        )}

        {currentStep === 2 && metadata && (
          <div>
            <FeaturesPropertyForm
              formData={propertyData || {}}
              onChange={handleUpdateProperty}
              onSubmit={handleSubmit}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              currentStep={currentStep}
              totalSteps={totalSteps}
              housingTypes={metadata.housingTypes}
            />
          </div>
        )}

        {currentStep === 3 && metadata && (
          <div>
            <DetailsPropertyForm
              formData={propertyData || {}}
              onChange={handleUpdateProperty}
              onSubmit={handleSubmit}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              currentStep={currentStep}
              totalSteps={totalSteps}
              commonAreas={metadata.commonAreas}
              nearbyServices={metadata.nearbyServices}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <ImagesPropertyForm
              formData={propertyData}
              onChange={handleUpdateProperty}
              onSubmit={handleFinalSubmit}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              currentStep={currentStep}
              totalSteps={totalSteps}
              imagesTypes={imagesTypes}
            />
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondaryLight transition-colors dark:bg-secondaryDark dark:hover:bg-secondaryLight"
          onClick={() => router.push("/admin/propiedades")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
