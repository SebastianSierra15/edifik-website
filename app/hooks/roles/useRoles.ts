import { useState, useEffect } from "react";
import { Role } from "@/lib/definitios";

export const useRoles = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch(
        `/api/roles?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching roles: ${response.statusText}`);
      }
      const data = await response.json();
      setRoles(data.roles);
      setTotalEntries(data.totalEntries);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, entriesPerPage, searchTerm]);

  return { roles, totalEntries, isLoadingRoles, refetchRoles: fetchRoles };
};
