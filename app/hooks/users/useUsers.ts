import { useState, useEffect, useCallback } from "react";
import { User } from "@/lib/definitios";

export const useUsers = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(
        `/api/users?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalEntries(data.totalEntries);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalEntries, isLoadingUsers, refetchUsers: fetchUsers };
};
