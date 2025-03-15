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
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch(
        `/api/roles?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
          searchTerm
        )}`
      );

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

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
