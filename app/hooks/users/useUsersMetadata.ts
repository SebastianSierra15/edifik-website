import { useState, useEffect } from "react";
import { Role, Gender, MembershipSummary } from "@/lib/definitios";

export const useUsersMetadata = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [memberships, setMemberships] = useState<MembershipSummary[]>([]);
  const [isLoadingUsersMetadata, setIsLoadingUsersMetadata] = useState(true);

  useEffect(() => {
    const fetchUsersMetadata = async () => {
      setIsLoadingUsersMetadata(true);
      try {
        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch("/api/users/metadata");
        if (!response.ok) {
          throw new Error(
            `Error en la busqueda de datos de usuario: ${response.statusText}`
          );
        }

        const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
        const serverTiming = response.headers.get("Server-Timing");

        console.log(
          `⏱️ Tiempo total de fetch para obtener metadata de usuarios: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log("⏳ Server Timing Metrics:", serverTiming);

        const data = await response.json();
        setRoles(data.roles);
        setGenders(data.genders);
        setMemberships(data.memberships);
      } catch (error) {
        console.error("Error en la busqueda de datos de usuario:", error);
      } finally {
        setIsLoadingUsersMetadata(false);
      }
    };

    fetchUsersMetadata();
  }, []);

  return { roles, genders, memberships, isLoadingUsersMetadata };
};
