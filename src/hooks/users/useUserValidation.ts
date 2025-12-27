import { useState } from "react";
import type { User } from "@/src/interfaces";
import { createUserSchema, updateUserSchema } from "@/src/schemas/admin";

type UserFormState = Partial<User>;

type UserValidationErrors = {
  namesError: string;
  lastnamesError: string;
  emailError: string;
  phoneNumberError: string;
  genderError: string;
  roleError: string;
  membershipError: string;
};

const fieldSchemaMap: Record<keyof UserValidationErrors, string> = {
  namesError: "names",
  lastnamesError: "lastnames",
  emailError: "email",
  phoneNumberError: "phoneNumber",
  genderError: "genderId",
  roleError: "roleId",
  membershipError: "membershipId",
};

const issueToErrorMap: Record<string, keyof UserValidationErrors> = {
  names: "namesError",
  lastnames: "lastnamesError",
  email: "emailError",
  phoneNumber: "phoneNumberError",
  genderId: "genderError",
  roleId: "roleError",
  membershipId: "membershipError",
};

const stringFields = new Set<keyof UserValidationErrors>([
  "namesError",
  "lastnamesError",
  "emailError",
  "phoneNumberError",
]);

const idFields = new Set<keyof UserValidationErrors>([
  "genderError",
  "roleError",
  "membershipError",
]);

const normalizeIdValue = (value: unknown) => {
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id?: number }).id ?? 0;
  }

  return value ?? 0;
};

export function useUserValidation(user: UserFormState, isEdit: boolean) {
  const [errors, setErrors] = useState<UserValidationErrors>({
    namesError: "",
    lastnamesError: "",
    emailError: "",
    phoneNumberError: "",
    genderError: "",
    roleError: "",
    membershipError: "",
  });

  const userSchema = isEdit ? updateUserSchema : createUserSchema;

  const validateField = async (
    fieldName: keyof UserValidationErrors,
    value: unknown
  ) => {
    const schemaKey = fieldSchemaMap[fieldName];
    const fieldSchema =
      userSchema.shape[schemaKey as keyof typeof userSchema.shape];
    const normalizedValue = stringFields.has(fieldName)
      ? (value ?? "")
      : idFields.has(fieldName)
        ? normalizeIdValue(value)
        : value;
    const result = fieldSchema.safeParse(normalizedValue);
    const errorMessage = result.success
      ? ""
      : (result.error.issues[0]?.message ?? "");

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async (): Promise<boolean> => {
    const result = userSchema.safeParse({
      names: user.names ?? "",
      lastnames: user.lastnames ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      genderId: user.gender?.id ?? 0,
      roleId: user.role?.id ?? 0,
      membershipId: user.membership?.id ?? 0,
    });

    const newErrors: UserValidationErrors = {
      namesError: "",
      lastnamesError: "",
      emailError: "",
      phoneNumberError: "",
      genderError: "",
      roleError: "",
      membershipError: "",
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

    setErrors(newErrors);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(newErrors).every((error) => error === ""));
      }, 0);
    });
  };

  return { errors, validateFields, validateField };
}
