import { useState, useEffect } from "react";
import { Request } from "@/lib/definitios";

export const useRequests = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string,
  refreshTrigger: number
) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoadingRequests(true);
      try {
        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch(
          `/api/requests?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
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
          throw new Error("Error fetching requests");
        }
        const data = await response.json();
        setRequests(data.requests);
        setTotalEntries(data.totalEntries);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    fetchRequests();
  }, [currentPage, entriesPerPage, searchTerm, refreshTrigger]);

  return { requests, totalEntries, isLoadingRequests };
};
