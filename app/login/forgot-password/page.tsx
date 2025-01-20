"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineExclamationCircle } from "react-icons/ai"; // Icono de advertencia
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setEmptyFieldError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmptyFieldError("El campo de correo electrónico es obligatorio.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      return;
    }
  };

  return (
    <div className="mt-10 flex h-screen w-full items-center justify-center md:mt-0">
      <div className="grid gap-8">
        <section id="back-div" className="rounded-2xl">
          <div className="m-2 rounded-xl bg-gray-50 p-8 shadow-xl">
            <h1 className="mb-6 cursor-default text-center text-2xl font-bold text-gray-900">
              Restablece tu contraseña
            </h1>

            <p className="mb-6 text-center text-gray-600">
              Escribe tu dirección de correo electrónico y te enviaremos las
              <br />
              instrucciones para restablecer la contraseña.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-base">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  className={`w-full transform rounded-lg border p-3 shadow-md transition duration-300 hover:scale-105 focus:ring-2 focus:ring-gray-800 ${
                    emailError || emptyFieldError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-500"
                  }`}
                  type="text"
                  placeholder="tu-email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {emailError && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-red-500">
                    <AiOutlineExclamationCircle className="h-5 w-5" />
                    {emailError}
                  </div>
                )}
                {emptyFieldError && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-red-500">
                    <AiOutlineExclamationCircle className="h-5 w-5" />
                    {emptyFieldError}
                  </div>
                )}
              </div>

              <button
                className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Continuar
              </button>

              <button
                className="mt-4 w-full transform rounded-lg bg-gray-200 p-3 text-gray-700 shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="button"
                onClick={() => router.push("/")}
              >
                Volver a EdifiK
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Acepta nuestros{" "}
                <Link
                  href="#"
                  className="text-blue-400 transition hover:underline"
                >
                  Términos
                </Link>{" "}
                y{" "}
                <Link
                  href="#"
                  className="text-blue-400 transition hover:underline"
                >
                  Política de privacidad
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
