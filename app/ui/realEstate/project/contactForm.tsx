"use client";

import React, { useState } from "react";
import clsx from "clsx";

interface ContactFormProps {
  name: string;
  email: string;
  phone: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
}

export default function ContactForm({
  name,
  email,
  phone,
  setName,
  setEmail,
  setPhone,
}: ContactFormProps) {
  // const [checked, setChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label form="inputName" className="mb-1 font-medium">
          Nombre
        </label>

        <input
          id="inputName"
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
        <label form="inputEmail" className="mb-1 font-medium">
          Correo electrónico
        </label>

        <input
          id="inputEmail"
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
        <label form="inputPhone" className="mb-1 font-medium">
          Celular o Teléfono
        </label>

        <input
          id="inputPhone"
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

      {/*
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
      */}
    </form>
  );
}
