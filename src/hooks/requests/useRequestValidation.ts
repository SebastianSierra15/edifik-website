import { useState } from "react";
import { processRequestSchema } from "@/src/schemas/admin";

export const useRequestValidation = () => {
  const [errors, setErrors] = useState<{
    messageError: string;
    actionTypeError: string;
  }>({
    messageError: "",
    actionTypeError: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: string) => {
    if (fieldName === "messageError") {
      const result = processRequestSchema.shape.message.safeParse(value);
      const errorMessage = result.success
        ? ""
        : (result.error.issues[0]?.message ?? "");

      setErrors((prevErrors) => ({
        ...prevErrors,
        messageError: errorMessage,
      }));
      return;
    }

    const result = processRequestSchema.shape.actionType.safeParse(value);
    const errorMessage = result.success
      ? ""
      : (result.error.issues[0]?.message ?? "");

    setErrors((prevErrors) => ({
      ...prevErrors,
      actionTypeError: errorMessage,
    }));
  };

  const validateFields = (message: string, actionType: string) => {
    const result = processRequestSchema.safeParse({ message, actionType });

    const newErrors = {
      messageError: "",
      actionTypeError: "",
    };

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "message" && !newErrors.messageError) {
          newErrors.messageError = issue.message;
        }

        if (field === "actionType" && !newErrors.actionTypeError) {
          newErrors.actionTypeError = issue.message;
        }
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
