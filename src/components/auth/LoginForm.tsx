"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader, ClientFormInput } from "@/src/components/shared";
import { useAlert } from "@/src/providers";
import { loginSchema } from "@/src/schemas/auth";

export function LoginForm() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setEmailError("");
    setPasswordError("");
    setEmptyFieldError("");

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const emailIssue = validationResult.error.issues.find(
        (issue) => issue.path[0] === "email"
      );
      const passwordIssue = validationResult.error.issues.find(
        (issue) => issue.path[0] === "password"
      );

      if (!email || !password) {
        setEmptyFieldError("Todos los campos son obligatorios.");
      }

      if (emailIssue && email) {
        setEmailError(emailIssue.message);
      }

      if (passwordIssue && password) {
        setPasswordError(passwordIssue.message);
      }

      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: validationResult.data.email,
      password: validationResult.data.password,
    });

    if (result?.error) {
      showAlert({
        type: "error",
        message: "Correo o contraseña incorrectos.",
      });
      setLoading(false);
      return;
    }

    if (result?.ok) {
      setLoading(false);
      router.push(result.url ?? "/");
      return;
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ClientFormInput
        label="Correo electrónico"
        name="email"
        type="text"
        value={email}
        placeholder="tu-email@ejemplo.com"
        onChange={(e) => setEmail(e.target.value)}
        error={emailError || emptyFieldError}
      />

      <ClientFormInput
        label="Contraseña"
        name="password"
        type="password"
        value={password}
        placeholder="••••••••"
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError || emptyFieldError}
      />

      <Link
        href="/auth/forgot-password"
        className="text-sm text-client-secondaryHover transition hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader size={20} /> : "Iniciar sesión"}
      </button>
    </form>
  );
}
