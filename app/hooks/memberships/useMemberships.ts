import { useState, useEffect } from "react";
import { Membership } from "@/lib/definitios";

export const useMemberships = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string,
  refreshTrigger: number
) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      setIsLoading(true);
      try {
        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch(
          `/api/memberships?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
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
          throw new Error("Failed to fetch memberships");
        }
        const data = await response.json();
        setMemberships(data.memberships);
        setTotalEntries(data.totalEntries);
      } catch (error) {
        console.error("Error fetching memberships:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberships();
  }, [currentPage, entriesPerPage, searchTerm, refreshTrigger]);

  return { memberships, totalEntries, isLoading };
};
