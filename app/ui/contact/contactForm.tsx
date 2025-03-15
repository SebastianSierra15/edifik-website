"use client";
import { useState } from "react";
import FormInput from "../modals/home/formInput";
import FormTextarea from "../modals/home/formTextArea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
  };

  return (
    <form
      className="space-y-4"
      aria-label="Formulario de contacto"
      onSubmit={handleSubmit}
    >
      <FormInput
        label="Nombre completo"
        name="name"
        type="text"
        value={formData.name}
        placeholder="Nombre completo"
        onChange={handleChange}
      />

      <FormInput
        label="Número de teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        placeholder="Número de teléfono"
        onChange={handleChange}
      />

      <FormInput
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        placeholder="Correo electrónico"
        onChange={handleChange}
      />

      <FormTextarea
        label="Mensaje"
        name="message"
        value={formData.message}
        placeholder="Mensaje"
        onChange={handleChange}
        rows={4}
      />

      <button
        type="submit"
        className="bg-transparent border border-client-text text-client-text px-4 py-2 rounded-full shadow-md text-lg font-medium hover:bg-white hover:text-black transition whitespace-nowrap"
      >
        Enviar ↗
      </button>
    </form>
  );
}
