"use client";

import React, { useState } from "react";
import clsx from "clsx";

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, email, phone });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Nombre</label>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 outline-none",
            "border-client-accent text-client-primaryLight"
          )}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Correo electrónico</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 outline-none",
            "border-client-accent text-client-primaryLight"
          )}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Celular o Teléfono</label>
        <input
          type="tel"
          placeholder="Número de contacto"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 outline-none",
            "border-client-accent text-client-primaryLight"
          )}
          required
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="form-checkbox mt-1 border-client-accent text-client-accent focus:ring-client-accent"
          required
        />
        <label className="ml-2 text-xs">
          Acepto los{" "}
          <a href="#" className="text-client-accent underline">
            términos y condiciones
          </a>
          .
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-md border py-2 font-semibold text-white bg-client-accentLight hover:bg-client-accentHover"
      >
        Contáctame
      </button>
    </form>
  );
}
