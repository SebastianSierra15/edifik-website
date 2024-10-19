"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import Link from "next/link";

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
    <div className="flex justify-center items-center mt-10 md:mt-0 h-screen w-full">
      <div className="grid gap-8">
        <section id="back-div" className="rounded-2xl">
          <div className="rounded-xl bg-gray-50 shadow-xl p-8 m-2">
            <h1 className="text-2xl mb-2 font-bold text-center cursor-default text-gray-900">
              Crea una cuenta
            </h1>

            {!showPasswordInput ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6 mt-8">
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
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-8">
                <div className="transition transform hover:scale-105 duration-300">
                  <label htmlFor="password" className="block mb-2 text-base">
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      className={`border p-3 shadow-md rounded-lg w-full focus:ring-2 focus:ring-gray-800 ${
                        passwordError
                          ? "border-red-500 bg-red-50"
                          : "border-gray-500"
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center text-gray-600 hover:bg-gray-300 hover:border-r-gray-500 hover:border-r hover:rounded-r-lg hover:border-t hover:border-t-gray-500 hover:border-b hover:border-b-gray-500"
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible className="w-5 h-5 mr-2 ml-2" />
                      ) : (
                        <AiFillEye className="w-5 h-5 mr-2 ml-2" />
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="text-red-500 text-sm flex items-center gap-2 mt-1">
                      <AiOutlineExclamationCircle className="w-5 h-5" />
                      {passwordError}
                    </div>
                  )}
                </div>

                <button
                  className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="submit"
                >
                  Continuar
                </button>

                {/* Botón volver */}
                <button
                  className="w-full p-3 mt-4 text-gray-700 bg-gray-200 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  type="button"
                  onClick={() => setShowPasswordInput(false)} // Regresar al formulario de correo
                >
                  Volver
                </button>
              </form>
            )}

            <div className="flex flex-col mt-4 text-sm text-center">
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
              className="flex justify-center gap-4 mt-5"
            >
              <button className="p-2 rounded-lg hover:scale-125 transition transform duration-300 shadow-lg">
                <FaGoogle className="w-6 h-6 text-red-500" />
              </button>
              <button className="p-2 rounded-lg hover:scale-125 transition transform duration-300 shadow-lg">
                <FaFacebook className="w-6 h-6 text-blue-600" />
              </button>
              <button className="p-2 rounded-lg hover:scale-125 transition transform duration-300 shadow-lg">
                <FaApple className="w-6 h-6 text-black" />
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
