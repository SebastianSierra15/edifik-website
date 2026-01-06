"use client";

import { useEffect, useState } from "react";
import { UserProfile, Gender } from "@/src/interfaces";
import { UserProfileService } from "@/src/services/user";

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, genders } = await UserProfileService.getProfile();
        const birthdate = user.birthdate
          ? new Date(user.birthdate)
          : undefined;
        const normalizedUser = {
          ...user,
          birthdate:
            birthdate && !Number.isNaN(birthdate.getTime())
              ? birthdate
              : undefined,
        };

        setUser(normalizedUser);
        setGenders(genders);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : null;
        setError(message || "Error al obtener el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { user, genders, loading, error };
}
