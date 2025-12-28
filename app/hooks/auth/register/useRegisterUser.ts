"use client";

import { useState } from "react";
import { registerUserSchema, RegisterUserInput } from "@/src/schemas/auth";

interface UseRegisterUserResult {
  registerUser: (data: RegisterUserInput) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useRegisterUser(): UseRegisterUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (data: RegisterUserInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const validationResult = registerUserSchema.safeParse(data);

      if (!validationResult.success) {
        setError(
          validationResult.error.issues[0]?.message ?? "Datos inválidos."
        );
        return false;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Error al registrar el usuario");
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error inesperado");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
}
