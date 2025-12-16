"use client";

import { useState } from "react";
import { AuthService, ChangePasswordInput } from "@/src/services";

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
    } catch (err: any) {
      setError(err.message || "No se pudo cambiar la contraseña");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success };
}
