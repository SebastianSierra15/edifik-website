import { useState, useEffect } from "react";
import { Permission } from "@/lib/definitios";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoadingPermissions(true);
      try {
        const response = await fetch("/api/roles/permissions");
        if (!response.ok) {
          throw new Error(
            `Error en la busqueda de permisos: ${response.statusText}`
          );
        }
        const data = await response.json();
        setPermissions(data.permissions);
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
