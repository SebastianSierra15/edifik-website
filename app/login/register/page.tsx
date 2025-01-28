"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@/app/ui/icons/googleIcon";
import FacebookIcon from "@/app/ui/icons/facebookIcon";
import AppleIcon from "@/app/ui/icons/appleIcon";
import FormErrorMessage from "@/app/ui/modals/formErrorMessage";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
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

    setShowPasswordInput(true); // Mostrar campo de contraseña si el correo es válido
  };

  // Validar contraseña y redirigir
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Si la contraseña es válida, redirigir a la página de login
    router.push("/login");
  };

  return (
    <div className="mt-10 flex h-screen w-full items-center justify-center md:mt-0">
      <div className="grid gap-8">
        <section id="back-div" className="rounded-2xl">
          <div className="m-2 rounded-xl bg-gray-50 p-8 shadow-xl">
            <h1 className="mb-2 cursor-default text-center text-2xl font-bold text-gray-900">
              Crea una cuenta
            </h1>

            {!showPasswordInput ? (
              <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-base">
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    className={clsx(
                      "w-full transform rounded-lg border p-3 shadow-md transition duration-300 hover:scale-105 focus:ring-2 focus:ring-gray-800",
                      emailError || emptyFieldError
                        ? "border-red-500 bg-red-50"
                        : "border-gray-500"
                    )}
                    type="text"
                    placeholder="tu-email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {emailError && <FormErrorMessage error={emailError} />}
                  {emptyFieldError && (
                    <FormErrorMessage error={emptyFieldError} />
                  )}
                </div>

                <button
                  className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="submit"
                >
                  Continuar
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
                <div className="transform transition duration-300 hover:scale-105">
                  <label htmlFor="password" className="mb-2 block text-base">
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      className={clsx(
                        "w-full rounded-lg border p-3 shadow-md focus:ring-2 focus:ring-gray-800",
                        passwordError
                          ? "border-red-500 bg-red-50"
                          : "border-gray-500"
                      )}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center text-gray-600 hover:rounded-r-lg hover:border-b hover:border-r hover:border-t hover:border-b-gray-500 hover:border-r-gray-500 hover:border-t-gray-500 hover:bg-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="ml-2 mr-2 h-5 w-5" />
                      ) : (
                        <Eye className="ml-2 mr-2 h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {passwordError && <FormErrorMessage error={passwordError} />}
                </div>

                <button
                  className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="submit"
                >
                  Continuar
                </button>

                {/* Botón volver */}
                <button
                  className="mt-4 w-full transform rounded-lg bg-gray-200 p-3 text-gray-700 shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  type="button"
                  onClick={() => setShowPasswordInput(false)} // Regresar al formulario de correo
                >
                  Volver
                </button>
              </form>
            )}

            <div className="mt-4 flex flex-col text-center text-sm">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="text-blue-500 transition hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>

            <div
              id="third-party-auth"
              className="mt-5 flex justify-center gap-4"
            >
              <button className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125">
                <GoogleIcon className="h-6 w-6 text-red-500" />
              </button>
              <button className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125">
                <FacebookIcon className="h-6 w-6 text-blue-600" />
              </button>
              <button className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125">
                <AppleIcon className="h-6 w-6 text-black" />
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Al crear una cuenta, acepta nuestros{" "}
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
