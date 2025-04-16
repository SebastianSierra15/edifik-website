"use client";

import { useState } from "react";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface UseChangePasswordResult {
  changePassword: (data: ChangePasswordInput) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useChangePassword(): UseChangePasswordResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (
    data: ChangePasswordInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "No se pudo cambiar la contraseña.");
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

  return { changePassword, loading, error, success };
}
