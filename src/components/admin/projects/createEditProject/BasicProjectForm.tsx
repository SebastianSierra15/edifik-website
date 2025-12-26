"use client";

import { useState, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import type { ProjectFormData, SimpleCatalog } from "@/src/interfaces";
import { useBasicProjectValidation } from "@/src/hooks/projects";
import { useCheckEmail } from "@/src/hooks/users";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextArea,
  FormSearchEmail,
} from "@/src/components/shared";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface BasicProjectFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  propertyTypes: SimpleCatalog[];
  currentStep: number;
  totalSteps: number;
  isProperty: boolean;
  isEdit: boolean;
  hasPermission?: boolean;
}

export function BasicProjectForm({
  formData,
  onChange,
  propertyTypes,
  onPrevious,
  currentStep,
  totalSteps,
  isProperty,
  isEdit,
  onNext,
  hasPermission,
}: BasicProjectFormProps) {
  const { errors, validateFields, validateField } = useBasicProjectValidation(
    formData,
    isProperty,
    isEdit
  );
  const { checkEmailExists } = useCheckEmail();
  const [ownerEmail, setOwnerEmail] = useState(formData.email || "");
  const debouncedValidateName = useDebouncedCallback(
    (value: string) => {
      void validateField("nameError", value);
    },
    300
  );

  const handleEmailChange = (email: string, ownerId: number | undefined) => {
    setOwnerEmail(email);
    onChange({ email, ownerId });
  };

  const propertyOptions = useMemo(
    () => propertyTypes.map((type) => ({ id: type.id, name: type.name })),
    [propertyTypes]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (formData[name as keyof ProjectFormData] !== value) {
        onChange({ [name]: value });
        if (name === "name") {
          debouncedValidateName(value);
        } else {
          validateField(`${name}Error` as keyof typeof errors, value);
        }
      }
    },
    [onChange, validateField, formData, debouncedValidateName]
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ membership: e.target.checked ? 1004 : 1001 });
    },
    [onChange]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      const selectedId = parseInt(value, 10);

      if (name === "propertyType") {
        const selectedPropertyType = propertyTypes.find(
          (type) => type.id === selectedId
        );
        if (selectedPropertyType) {
          onChange({ propertyType: selectedPropertyType });
          validateField("propertyTypeError", selectedPropertyType);
        }
      }

      if (name === "projectType") {
        if (selectedId === 2 || selectedId === 3) {
          onChange({
            projectType: {
              id: selectedId,
              name: selectedId === 2 ? "Venta" : "Arriendo",
            },
          });
          validateField("projectTypeError", { id: selectedId });
        }
      }
    },
    [onChange, propertyTypes, validateField]
  );

  const handleNext = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (formData.email && !formData.ownerId) {
        const ownerId = await checkEmailExists(formData.email);

        if (!ownerId) {
          await validateField("emailError", formData.email);
          return;
        }

        await new Promise((resolve) => {
          onChange({ ownerId });
          setTimeout(resolve, 0);
        });
      }

      const isValid = await validateFields();
      if (!isValid) return;

      onNext();
    },
    [
      validateFields,
      onNext,
      checkEmailExists,
      formData,
      onChange,
      validateField,
    ]
  );

  const tooltipTexts = useMemo(
    () => ({
      name: "Nombre del proyecto que se mostrará al público.",
      propertyType: isProperty
        ? "Seleccione el tipo de propiedad que más se ajuste."
        : "Seleccione el tipo de propiedad que más se ajuste a su proyecto.",
      projectType:
        "Seleccione si la propiedad va a estar en venta o en arriendo.",
      shortDescription: isProperty
        ? "Escriba un resumen breve que describa las principales características de la propiedad."
        : "Escriba un resumen breve que describa las principales características del proyecto.",
      detailedDescription: isProperty
        ? "Incluya una descripción detallada que explique las características principales de la propiedad."
        : "Incluya una descripción detallada que explique las características principales del proyecto.",
    }),
    [isProperty]
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Datos Básicos
      </h2>
      <form onSubmit={handleNext} className="space-y-6">
        {!isProperty && (
          <FormInput
            label={
              isProperty ? "Nombre de la propiedad" : "Nombre del proyecto"
            }
            type="text"
            name="name"
            value={formData.name || ""}
            placeholder={
              isProperty
                ? "Ingrese el nombre de la propiedad"
                : "Ingrese el nombre del proyecto"
            }
            maxLength={100}
            onChange={handleChange}
            error={errors.nameError}
            tooltipText={tooltipTexts.name}
          />
        )}

        <div
          className={clsx(
            "grid grid-cols-1 gap-4",
            isProperty && "sm:grid-cols-2"
          )}
        >
          <FormSelect
            label="Tipo de propiedad"
            name="propertyType"
            value={formData.propertyType?.id || ""}
            options={propertyOptions}
            onChange={handleSelectChange}
            error={errors.propertyTypeError}
            tooltipText={tooltipTexts.propertyType}
          />

          {isProperty && (
            <FormSelect
              label="Finalidad de la propiedad"
              name="projectType"
              value={formData.projectType?.id || ""}
              options={[
                { id: 2, name: "Venta" },
                { id: 3, name: "Arriendo" },
              ]}
              onChange={handleSelectChange}
              error={errors.projectTypeError}
              tooltipText={tooltipTexts.projectType}
            />
          )}
        </div>

        {isProperty && hasPermission && (
          <FormSearchEmail
            label="Correo del Propietario"
            value={ownerEmail}
            onChange={setOwnerEmail}
            onSelect={(email, ownerId) => handleEmailChange(email, ownerId)}
            error={errors.emailError}
            tooltipText="Seleccione el propietario de la propiedad (si es un proyecto propio de la empresa puedes omitir este campo)."
          />
        )}

        <FormTextArea
          label="Resumen breve"
          name="shortDescription"
          value={formData.shortDescription || ""}
          placeholder="Agregue un resumen breve"
          tooltipText={tooltipTexts.shortDescription}
          onChange={handleChange}
          error={errors.shortDescriptionError}
          rows={3}
          maxLength={150}
        />

        <FormTextArea
          label="Descripción completa"
          name="detailedDescription"
          value={formData.detailedDescription || ""}
          placeholder="Agregue una descripción completa y detallada"
          tooltipText={tooltipTexts.detailedDescription}
          onChange={handleChange}
          error={errors.detailedDescriptionError}
          rows={6}
          maxLength={1500}
        />

        <FormCheckbox
          label="Propio de la empresa"
          name="membership"
          checked={formData.membership === 1004}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-premium-primary focus:ring-premium-primary"
        />

        <StepNavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleNext}
        />
      </form>
    </div>
  );
}
