import { useState, useEffect, useCallback, useRef } from "react";
import { Membership } from "@/src/interfaces";
import { MembershipService } from "@/src/services/memberships";

export function usePublicMemberships(
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string,
  refreshTrigger: number
) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const fetchMemberships = useCallback(async () => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setIsLoading(true);
    try {
      const { memberships, totalEntries } =
        await MembershipService.getPublicMemberships(
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

      setMemberships(memberships);
      setTotalEntries(totalEntries);
    } catch (error: unknown) {
      const isAbortError =
        error instanceof Error && error.name === "AbortError";
      if (!isAbortError) {
        if (requestControllerRef.current !== controller) {
          return;
        }
        console.error("Error loading memberships:", error);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships, refreshTrigger]);

  return {
    memberships,
    totalEntries,
    isLoading,
    refetchMemberships: fetchMemberships,
  };
}
