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
        const response = await fetch(
          `/api/requests?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
            searchTerm
          )}`
        );

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
