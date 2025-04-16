"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResetPassword } from "@/app/hooks/auth/resetPassword/useResetPassword";
import Logo from "../header/logo";
import FormInput from "@/app/ui/modals/home/formInput";

export default function ClientForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const { resetPassword, loading, error, success } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setFormMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("El campo de correo electrónico es obligatorio.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      return;
    }

    const ok = await resetPassword(email);

    if (ok) {
      setFormMessage("Hemos enviado un código a tu correo electrónico.");
    } else if (error) {
      setFormMessage(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-md w-full bg-client-backgroundAlt p-10 rounded-2xl shadow my-8 space-y-6">
        <div className="-translate-x-4">
          <Logo />
        </div>

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

          {formMessage && (
            <p
              className={`text-sm text-center ${
                success
                  ? "text-green-500"
                  : error
                    ? "text-red-500"
                    : "text-yellow-500"
              }`}
            >
              {formMessage}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando código..." : "Restablecer contraseña"}
          </button>
        </form>

        <button
          className="w-full rounded-lg bg-client-backgroundLight p-3 text-client-text shadow-lg transition hover:bg-client-backgroundDark -translate-y-4"
          type="button"
          onClick={() => router.push("/")}
        >
          Volver a EdifiK
        </button>

        <div className="flex justify-center mt-4">
          <p className="text-client-textSecondary">
            ¿Recordaste tu contraseña?
          </p>
          <Link
            href="/login"
            className="ml-2 text-client-text transition hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
