"use client";

import { useState } from "react";
import { AuthService, RegisterUserInput } from "@/src/services";

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (data: RegisterUserInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await AuthService.register(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
}
