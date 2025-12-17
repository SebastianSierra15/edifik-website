import { useEffect, useState } from "react";
import { Permission } from "@/src/interfaces";
import { RoleService } from "@/src/services/roles";

export function useRoleMetadata() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const result = await RoleService.getPermissions();
        setPermissions(result);
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, loading };
}
