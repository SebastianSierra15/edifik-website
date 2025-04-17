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
    toEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^3\d{9}$/;

    const isPhoneValid = phoneRegex.test(formData.phone.replace(/\s+/g, ""));

    const newErrors = {
      name: formData.name.trim() ? "" : "El nombre es obligatorio.",
      phone: formData.phone.trim()
        ? isPhoneValid
          ? ""
          : "Número de teléfono no válido."
        : "El teléfono es obligatorio.",
      email: formData.email.trim()
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? ""
          : "El correo no es válido."
        : "El correo es obligatorio.",
      message: formData.message.trim() ? "" : "El mensaje es obligatorio.",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Mensaje enviado correctamente.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          toEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
        });
      } else {
        alert("❌ Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("❌ Error inesperado. Intenta más tarde.");
    } finally {
      setIsSubmitting(false);
    }
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
        maxLength={50}
        error={errors.name}
      />

      <FormInput
        label="Número de teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        placeholder="Número de teléfono"
        onChange={handleChange}
        maxLength={15}
        error={errors.phone}
      />

      <FormInput
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        placeholder="Correo electrónico"
        onChange={handleChange}
        maxLength={50}
        error={errors.email}
      />

      <FormTextarea
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
