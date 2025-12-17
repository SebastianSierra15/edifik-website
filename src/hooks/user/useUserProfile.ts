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

        setUser(user);
        setGenders(genders);
      } catch (err: any) {
        setError(err.message || "Error al obtener el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { user, genders, loading, error };
}
