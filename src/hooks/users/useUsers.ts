import { useState, useEffect, useCallback } from "react";
import { User } from "@/src/interfaces";
import { UserService } from "@/src/services/users";

export const useUsers = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const { users, totalEntries } = await UserService.getUsers({
        page: currentPage,
        pageSize: entriesPerPage,
        searchTerm,
      });

      setUsers(users);
      setTotalEntries(totalEntries);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    totalEntries,
    isLoadingUsers,
    refetchUsers: fetchUsers,
  };
};
