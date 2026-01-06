import { useState } from "react";
import { RoleWrite } from "@/src/interfaces";
import { createRoleSchema, updateRoleSchema } from "@/src/schemas/admin";
import { useCheckName } from "../checkName";

export const useRoleValidation = (role: RoleWrite, isEdit: boolean) => {
  const [errors, setErrors] = useState<{
    nameError: string;
    permissionsError: string;
  }>({
    nameError: "",
    permissionsError: "",
  });

  const { checkName } = useCheckName();
  const roleSchema = isEdit ? updateRoleSchema : createRoleSchema;

  const validateField = async (
    fieldName: keyof typeof errors,
    value: unknown
  ) => {
    if (fieldName === "nameError") {
      const result = roleSchema.shape.name.safeParse(value);
      let errorMessage = result.success
        ? ""
        : (result.error.issues[0]?.message ?? "");

      if (!errorMessage && typeof value === "string" && value) {
        const total = await checkName(
          "role",
          value,
          isEdit ? role.id : undefined
        );

        if (total > 0) {
          errorMessage = "El nombre del rol ya está en uso, elige otro.";
        }
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        nameError: errorMessage,
      }));
      return;
    }

    const result = roleSchema.shape.permissions.safeParse(value);
    const errorMessage = result.success
      ? ""
      : (result.error.issues[0]?.message ?? "");

    setErrors((prevErrors) => ({
      ...prevErrors,
      permissionsError: errorMessage,
    }));
  };

  const validateFields = async () => {
    const result = roleSchema.safeParse({
      name: role.name,
      permissions: role.permissions,
    });

    const newErrors: typeof errors = {
      nameError: "",
      permissionsError: "",
    };

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "name" && !newErrors.nameError) {
          newErrors.nameError = issue.message;
        }

        if (field === "permissions" && !newErrors.permissionsError) {
          newErrors.permissionsError = issue.message;
        }
      }
    }

    if (role.name) {
      const total = await checkName(
        "role",
        role.name,
        isEdit ? role.id : undefined
      );

      if (total > 0) {
        newErrors.nameError = "El nombre del rol ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
