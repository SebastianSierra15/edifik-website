"use client";

import { useState, type SyntheticEvent } from "react";
import { ContactService } from "@/src/services/contact";

interface UseProjectContactFormParams {
  propertyId: number;
  propertyName: string;
  toEmail: string;
}

const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;

export function useProjectContactForm({
  propertyId,
  propertyName,
  toEmail,
}: UseProjectContactFormParams) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event?: SyntheticEvent) => {
    event?.preventDefault();

    const phoneRegex = /^3\d{9}$/;
    const isPhoneValid = phoneRegex.test(phone.replace(/\s+/g, ""));

    const errors = {
      name: name.trim() ? "" : "El nombre es obligatorio.",
      phone: phone.trim()
        ? isPhoneValid
          ? ""
          : "Número de teléfono no válido."
        : "El teléfono es obligatorio.",
      email: email.trim()
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "El correo no es válido."
        : "El correo es obligatorio.",
    };

    if (Object.values(errors).some((error) => error !== "")) {
      alert(
        Object.values(errors)
          .filter((error) => error !== "")
          .join("\n")
      );
      return;
    }

    const message = `Hola, estoy interesado en la propiedad "${propertyName}" con ID: ${propertyId}.\n\nMe pueden contactar al correo: ${email}.`;
    const payload = { name, email, phone, message };

    try {
      setIsSubmitting(true);

      await ContactService.sendContactMessage({ ...payload, toEmail });

      let enviadoEmpresa = true;

      if (toEmail !== companyEmail) {
        try {
          await ContactService.sendContactMessage({
            ...payload,
            toEmail: companyEmail,
          });
        } catch (error) {
          enviadoEmpresa = false;
          console.warn("No se pudo enviar el correo a la empresa.");
        }
      }

      setName("");
      setEmail("");
      setPhone("");

      if (enviadoEmpresa) {
        alert("Mensaje enviado correctamente.");
      } else {
        alert(
          "Mensaje enviado al destinatario, pero no se pudo notificar a la empresa."
        );
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    email,
    phone,
    setName,
    setEmail,
    setPhone,
    isSubmitting,
    handleSubmit,
  };
}
