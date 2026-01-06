"use client";

import { ClientFormInput, ClientFormTextArea } from "@/src/components/shared";
import { useContactForm } from "@/src/hooks/contact";

export function ContactForm() {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useContactForm();

  return (
    <form
      className="space-y-4"
      aria-label="Formulario de contacto"
      onSubmit={handleSubmit}
    >
      <ClientFormInput
        label="Nombre completo"
        name="name"
        type="text"
        value={formData.name}
        placeholder="Nombre completo"
        onChange={handleChange}
        maxLength={50}
        error={errors.name}
      />

      <ClientFormInput
        label="Número de teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        placeholder="Número de teléfono"
        onChange={handleChange}
        maxLength={15}
        error={errors.phone}
      />

      <ClientFormInput
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        placeholder="Correo electrónico"
        onChange={handleChange}
        maxLength={50}
        error={errors.email}
      />

      <ClientFormTextArea
        label="Mensaje"
        name="message"
        value={formData.message}
        placeholder="Mensaje"
        onChange={handleChange}
        rows={4}
        maxLength={500}
        error={errors.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-transparent border border-client-text text-client-text px-4 py-2 rounded-full shadow-md text-lg font-medium hover:bg-white hover:text-black transition whitespace-nowrap disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar ↗"}
      </button>
    </form>
  );
}
