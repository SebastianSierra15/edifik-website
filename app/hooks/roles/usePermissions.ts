import { useState, useEffect } from "react";
import { Permission } from "@/lib/definitios";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoadingPermissions(true);
      try {
        const startFetch = performance.now(); // ⏳ Inicia medición
        const response = await fetch("/api/roles/permissions");
        if (!response.ok) {
          throw new Error(
            `Error en la busqueda de permisos: ${response.statusText}`
          );
        }
        const serverTiming = response.headers.get("Server-Timing");
        console.log("⏳ Server Timing - Permissions API:", serverTiming);

        const data = await response.json();
        const endFetch = performance.now(); // ⏳ Finaliza medición

        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        setPermissions(data.permission);
      } catch (error) {
        console.error("Error en la busqueda de permisos:", error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, isLoadingPermissions };
};
