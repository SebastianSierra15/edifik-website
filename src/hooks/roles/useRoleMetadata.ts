import { useEffect, useState } from "react";
import { Permission } from "@/src/interfaces";
import {
  fetchRolePermissions,
  getCachedRolePermissions,
} from "@/src/hooks/admin/metadata/adminMetadataCache";

export function useRoleMetadata() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedRolePermissions();

    if (cached) {
      setPermissions(cached);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);

    fetchRolePermissions()
      .then((data) => {
        if (!isMounted) return;
        setPermissions(data);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error loading permissions:", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { permissions, loading };
}
