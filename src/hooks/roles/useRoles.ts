import { useState, useEffect, useCallback, useRef } from "react";
import { RoleWithPermissions } from "@/src/interfaces";
import { RoleService } from "@/src/services/roles";

export function useRoles(
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) {
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const fetchRoles = useCallback(async () => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setLoading(true);
    try {
      const { roles, totalEntries } = await RoleService.getRoles(
        {
          page: currentPage,
          pageSize: entriesPerPage,
          searchTerm,
        },
        { signal: controller.signal }
      );

      if (requestControllerRef.current !== controller) {
        return;
      }

      setRoles(roles);
      setTotalEntries(totalEntries);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        if (requestControllerRef.current !== controller) {
          return;
        }
        console.error("Error loading roles:", error);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setLoading(false);
      }
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
