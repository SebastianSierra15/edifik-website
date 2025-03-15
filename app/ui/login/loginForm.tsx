"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "../modals/home/formInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.error) {
        router.push("/");
      } else {
        setPasswordError("Credenciales incorrectas.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Correo electrónico"
        name="email"
        type="text"
        value={email}
        placeholder="tu-email@ejemplo.com"
        onChange={(e) => setEmail(e.target.value)}
        error={emailError || emptyFieldError}
      />

      <FormInput
        label="Contraseña"
        name="password"
        type={"password"}
        value={password}
        placeholder="••••••••"
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError || emptyFieldError}
      />

      <Link
        href="/login/forget-password"
        className="text-sm text-client-secondaryHover transition hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <button className="mt-4 w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover">
        Iniciar sesión
      </button>
    </form>
  );
}
