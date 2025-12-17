"use client";

import { useState } from "react";
import { AuthService } from "@/src/services/auth";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await AuthService.resetPassword(email);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error al solicitar recuperación de contraseña");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
}
