"use client";

import { useState } from "react";
import type { ContactFormInput, ContactMessagePayload } from "@/src/interfaces";
import { contactFormSchema } from "@/src/schemas/contact";
import { ContactService } from "@/src/services/contact";

const initialFormData: ContactFormInput = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const initialErrors: Record<keyof ContactFormInput, string> = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormInput>(initialFormData);
  const [errors, setErrors] =
    useState<Record<keyof ContactFormInput, string>>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(initialErrors);

    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] ?? "",
        phone: fieldErrors.phone?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        message: fieldErrors.message?.[0] ?? "",
      });
      return;
    }

    const payload: ContactMessagePayload = {
      ...validationResult.data,
      toEmail: companyEmail,
    };

    setIsSubmitting(true);

    try {
      await ContactService.sendContactMessage(payload);
      alert("Mensaje enviado correctamente.");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage =
        error instanceof TypeError
          ? "Error inesperado. Intenta más tarde."
          : "Hubo un error al enviar el mensaje.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
