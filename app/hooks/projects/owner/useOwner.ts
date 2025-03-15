import { useState, useEffect } from "react";
import { UserData } from "@/lib/definitios";

export const useOwner = (email: string) => {
  const [owner, setOwner] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!email) {
      setError("Debe proporcionar un email de usuario.");
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);
    setError(null);
    try {
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch(
        `/api/projects/owner?email=${encodeURIComponent(email)}`
      );

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        throw new Error(`Error al obtener usuario: ${response.statusText}`);
      }
      const data = await response.json();
      setOwner(data.user);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setError("No se pudo recuperar la información del usuario.");
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email]);

  return { owner, isLoadingUser, error, refetchUser: fetchUser };
};
