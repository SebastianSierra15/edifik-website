"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import { Eye } from "lucide-react";
import GoogleIcon from "../ui/icons/googleIcon";
import FacebookIcon from "../ui/icons/facebookIcon";
import AppleIcon from "../ui/icons/appleIcon";

const EyeOff = dynamic(() => import("lucide-react").then((mod) => mod.EyeOff));
const Info = dynamic(() => import("lucide-react").then((mod) => mod.Info));

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setEmptyFieldError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!email || !password) {
      setEmptyFieldError("Todos los campos son obligatorios.");
      isValid = false;
    }

    if (email && !emailRegex.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      isValid = false;
    }

    if (password && password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      isValid = false;
    }

    if (isValid) {
      router.push("/");
    }
  };

  return (
    <div className="mt-10 flex h-screen w-full items-center justify-center bg-white bg-[radial-gradient(rgba(12,12,12,0.171)_2px,transparent_0)] bg-[length:30px_30px] bg-[position:-5px_-5px] md:mt-0">
      <section
        id="back-div"
        className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-lg"
      >
        <h1 className="mb-2 cursor-default text-center text-2xl font-bold text-gray-900">
          Bienvenido a EdifiK
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

            {emailError && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-500">
                <Info className="h-5 w-5" />
                {emailError}
              </div>
            )}
          </div>

          <div className="transform transition duration-300 hover:scale-105">
            <label htmlFor="password" className="mb-2 block text-base">
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                className={clsx(
                  "w-full rounded-lg border p-3 shadow-md focus:ring-2 focus:ring-gray-800",
                  passwordError || emptyFieldError
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

            {passwordError && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-500">
                <Info className="h-5 w-5" />
                {passwordError}
              </div>
            )}
          </div>

          {emptyFieldError && (
            <div className="mt-1 flex items-center gap-2 text-sm text-red-500">
              <Info className="h-5 w-5" />
              {emptyFieldError}
            </div>
          )}

          <Link
            href="/login/forgot-password"
            className="text-sm text-blue-500 transition hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <button
            className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            Continuar
          </button>
        </form>

        <div className="mt-4 flex flex-col text-center text-sm">
          <p>
            ¿No tienes cuenta?{" "}
            <Link
              href="/login/register"
              className="text-blue-500 transition hover:underline"
            >
              Registrate
            </Link>
          </p>
        </div>

        <div id="third-party-auth" className="mt-5 flex justify-center gap-4">
          <button
            className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125"
            onClick={async () => {
              await signIn("google", { callbackUrl: "/admin" });
            }}
          >
            <GoogleIcon className="h-6 w-6" />
          </button>

          <button className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125">
            <FacebookIcon className="h-6 w-6" />
          </button>

          <button className="transform rounded-lg p-2 shadow-lg transition duration-300 hover:scale-125">
            <AppleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Al iniciar sesión, acepta nuestros{" "}
            <Link href="#" className="text-blue-400 transition hover:underline">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="#" className="text-blue-400 transition hover:underline">
              Política de privacidad
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
