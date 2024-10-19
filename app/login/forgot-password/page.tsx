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

    console.log("Correo válido: ", email);
  };

  return (
    <div className="flex justify-center items-center mt-10 md:mt-0 h-screen w-full">
      <div className="grid gap-8">
        <section id="back-div" className="rounded-2xl">
          <div className="rounded-xl bg-gray-50 shadow-xl p-8 m-2">
            <h1 className="text-2xl mb-6 font-bold text-center cursor-default text-gray-900">
              Restablece tu contraseña
            </h1>

            <p className="text-center text-gray-600 mb-6">
              Escribe tu dirección de correo electrónico y te enviaremos las
              <br />
              instrucciones para restablecer la contraseña.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div>
                <label htmlFor="email" className="block mb-2 text-base">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  className={`border p-3 shadow-md rounded-lg w-full focus:ring-2 focus:ring-gray-800 transition transform hover:scale-105 duration-300 ${
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
                  <div className="text-red-500 text-sm flex items-center gap-2 mt-1">
                    <AiOutlineExclamationCircle className="w-5 h-5" />
                    {emailError}
                  </div>
                )}
                {emptyFieldError && (
                  <div className="text-red-500 text-sm flex items-center gap-2 mt-1">
                    <AiOutlineExclamationCircle className="w-5 h-5" />
                    {emptyFieldError}
                  </div>
                )}
              </div>

              <button
                className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Continuar
              </button>

              <button
                className="w-full p-3 mt-4 text-gray-700 bg-gray-200 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
