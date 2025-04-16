"use client";

import { useState } from "react";

interface UseResetPasswordResult {
  resetPassword: (email: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useResetPassword(): UseResetPasswordResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(
          error || "Error al solicitar recuperación de contraseña"
        );
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

  return { resetPassword, loading, error, success };
}
