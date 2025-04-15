"use client";

import { useEffect, useState } from "react";
import { User, Gender } from "@/lib/definitios";

interface UseUserProfileResult {
  user: User | null;
  genders: Gender[];
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Error al obtener el perfil");
        }

        const data = await res.json();
        setUser(data.user);
        setGenders(data.genders || []);
      } catch (err: any) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, genders, loading, error };
}
