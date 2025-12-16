import { useState, useEffect, useCallback } from "react";
import { Membership } from "@/src/interfaces";
import { MembershipService } from "@/src/services";

export function useMemberships(
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string,
  refreshTrigger: number
) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemberships = useCallback(async () => {
    setIsLoading(true);
    try {
      const { memberships, totalEntries } =
        await MembershipService.getMemberships({
          page: currentPage,
          pageSize: entriesPerPage,
          searchTerm,
        });

      setMemberships(memberships);
      setTotalEntries(totalEntries);
    } catch (error) {
      console.error("Error loading memberships:", error);
    } finally {
      setIsLoading(false);
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
