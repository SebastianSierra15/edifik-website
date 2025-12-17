import { useState, useEffect, useCallback } from "react";
import { Request } from "@/src/interfaces";
import { RequestService } from "@/src/services/requests";

export function useRequests(
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string,
  refreshTrigger: number
) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const { requests, totalEntries } = await RequestService.getRequests({
        page: currentPage,
        pageSize: entriesPerPage,
        searchTerm,
      });

      setRequests(requests);
      setTotalEntries(totalEntries);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, refreshTrigger]);

  return {
    requests,
    totalEntries,
    isLoadingRequests,
    refetchRequests: fetchRequests,
  };
}
