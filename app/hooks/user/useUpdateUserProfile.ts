"use client";

import { useState } from "react";

interface UpdateProfileInput {
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date;
  phoneNumber?: string;
  genderId?: number;
}

interface UseUpdateUserProfileResult {
  updateUserProfile: (data: UpdateProfileInput) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useUpdateUserProfile(): UseUpdateUserProfileResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserProfile = async (data: UpdateProfileInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Error al actualizar el perfil");
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

  return { updateUserProfile, loading, error, success };
}
