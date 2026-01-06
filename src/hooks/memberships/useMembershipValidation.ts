import { useState } from "react";
import { Membership, NameValidationTarget } from "@/src/interfaces";
import {
  createMembershipSchema,
  updateMembershipSchema,
} from "@/src/schemas/admin";
import { useCheckName } from "../checkName";

type MembershipErrors = {
  nameError: string;
  benefitsError: string;
  discountThreeMonthsError: string;
  discountSixMonthsError: string;
  discountTwelveMonthsError: string;
  maxProjectsError: string;
};

const fieldSchemaMap: Record<keyof MembershipErrors, string> = {
  nameError: "name",
  benefitsError: "benefits",
  discountThreeMonthsError: "discountThreeMonths",
  discountSixMonthsError: "discountSixMonths",
  discountTwelveMonthsError: "discountTwelveMonths",
  maxProjectsError: "maxProjects",
};

const issueToErrorMap: Record<string, keyof MembershipErrors> = {
  name: "nameError",
  benefits: "benefitsError",
  discountThreeMonths: "discountThreeMonthsError",
  discountSixMonths: "discountSixMonthsError",
  discountTwelveMonths: "discountTwelveMonthsError",
  maxProjects: "maxProjectsError",
};

export const useMembershipValidation = (
  membership: Membership,
  isEdit: boolean
) => {
  const { checkName } = useCheckName();
  const membershipSchema = isEdit
    ? updateMembershipSchema
    : createMembershipSchema;

  const [errors, setErrors] = useState<MembershipErrors>({
    nameError: "",
    benefitsError: "",
    discountThreeMonthsError: "",
    discountSixMonthsError: "",
    discountTwelveMonthsError: "",
    maxProjectsError: "",
  });

  const validateField = async (
    fieldName: keyof MembershipErrors,
    value: unknown
  ) => {
    if (fieldName === "nameError") {
      const result = membershipSchema.shape.name.safeParse(value);
      let errorMessage = result.success
        ? ""
        : (result.error.issues[0]?.message ?? "");

      if (!errorMessage && typeof value === "string" && value) {
        const total = await checkName(
          NameValidationTarget.Membership,
          value,
          isEdit ? membership.id : undefined
        );

        if (total > 0) {
          errorMessage =
            "El nombre de la membresía ya está en uso, elige otro.";
        }
      }

      setErrors((prev) => ({
        ...prev,
        nameError: errorMessage,
      }));
      return;
    }

    const schemaKey = fieldSchemaMap[fieldName];
    const fieldSchema =
      membershipSchema.shape[schemaKey as keyof typeof membershipSchema.shape];
    const result = fieldSchema.safeParse(value);
    const errorMessage = result.success
      ? ""
      : (result.error.issues[0]?.message ?? "");

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async (): Promise<boolean> => {
    const result = membershipSchema.safeParse({
      name: membership.name,
      benefits: membership.benefits,
      price: membership.price,
      projectsFeatured: membership.projectsFeatured,
      discountThreeMonths: membership.discountThreeMonths,
      discountSixMonths: membership.discountSixMonths,
      discountTwelveMonths: membership.discountTwelveMonths,
      maxProjects: membership.maxProjects,
    });

    const newErrors: MembershipErrors = {
      nameError: "",
      benefitsError: "",
      discountThreeMonthsError: "",
      discountSixMonthsError: "",
      discountTwelveMonthsError: "",
      maxProjectsError: "",
    };

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        const errorKey = issueToErrorMap[String(field)];

        if (errorKey && !newErrors[errorKey]) {
          newErrors[errorKey] = issue.message;
        }
      }
    }

    if (membership.name) {
      const total = await checkName(
        NameValidationTarget.Membership,
        membership.name,
        isEdit ? membership.id : undefined
      );

      if (total > 0) {
        newErrors.nameError =
          "El nombre de la membresía ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  return {
    errors,
    validateField,
    validateFields,
  };
};
