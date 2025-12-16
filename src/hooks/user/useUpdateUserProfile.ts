"use client";

import { useState } from "react";
import { UserProfileService } from "@/src/services";

interface UpdateProfileInput {
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date | null;
  phoneNumber?: string;
  genderId?: number | null;
}

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserProfile = async (
    data: UpdateProfileInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await UserProfileService.updateProfile(data);
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
