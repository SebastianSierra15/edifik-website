import { useState, useEffect, useCallback } from "react";
import { Role } from "@/src/interfaces";
import { RoleService } from "@/src/services/roles";

export function useRoles(
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const { roles, totalEntries } = await RoleService.getRoles({
        page: currentPage,
        pageSize: entriesPerPage,
        searchTerm,
      });

      setRoles(roles);
      setTotalEntries(totalEntries);
    } catch (error) {
      console.error("Error loading roles:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    totalEntries,
    loading,
    refetchRoles: fetchRoles,
  };
}
