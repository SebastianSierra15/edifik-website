"use client";

import { useState } from "react";
import { AuthService, ChangePasswordInput } from "@/src/services/auth";

export function useChangePassword() {
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
      await AuthService.changePassword(data);
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null;
      setError(message || "No se pudo cambiar la contraseña");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success };
}
