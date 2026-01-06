import { useState, useEffect, useCallback, useRef } from "react";
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
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const fetchRequests = useCallback(async () => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setIsLoadingRequests(true);
    try {
      const { requests, totalEntries } = await RequestService.getRequests(
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

      setRequests(requests);
      setTotalEntries(totalEntries);
    } catch (error: unknown) {
      const isAbortError =
        error instanceof Error && error.name === "AbortError";
      if (!isAbortError) {
        if (requestControllerRef.current !== controller) {
          return;
        }
        console.error("Error fetching requests:", error);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsLoadingRequests(false);
      }
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
