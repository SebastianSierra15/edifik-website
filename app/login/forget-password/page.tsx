"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FormInput from "@/app/ui/modals/home/formInput";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("El campo de correo electrónico es obligatorio.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      return;
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-md w-full space-y-6 p-8">
        <Image
          src="/images/logo.webp"
          alt="Logo de EdifiK"
          width={90}
          height={36}
          priority
          className="mt-10 sm:mt-0 w-32 h-14 object-contain"
        />

        <div>
          <h1 className="mt-2 text-2xl font-bold text-client-text">
            Oh no... Recupera tu contraseña
          </h1>

          <p className="text-client-textSecondary">
            ¿Olvidaste tu contraseña? Ingresa tu correo y te enviaremos un
            enlace para restablecerla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            name="email"
            type="text"
            value={email}
            placeholder="tu-email@ejemplo.com"
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <button
            className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover"
            type="submit"
          >
            Restablecer contraseña
          </button>
        </form>

        <div className="text-center text-sm text-client-textSecondary">
          <p>
            ¿Necesitas ayuda?{" "}
            <Link
              href="#"
              className="ml-2 text-client-text transition hover:underline"
            >
              Contactar soporte
            </Link>
          </p>
        </div>

        <button
          className="w-full rounded-lg bg-client-backgroundLight p-3 text-client-text shadow-lg transition hover:bg-client-backgroundAlt"
          type="button"
          onClick={() => router.push("/")}
        >
          Volver a EdifiK
        </button>
      </div>
    </div>
  );
}
