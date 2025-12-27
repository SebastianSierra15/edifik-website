import { useState, useEffect, useCallback, useRef } from "react";
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
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setIsLoadingUsers(true);
    try {
      const { users, totalEntries } = await UserService.getUsers(
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

      setUsers(users);
      setTotalEntries(totalEntries);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        if (requestControllerRef.current !== controller) {
          return;
        }
        console.error("Error fetching users:", error);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsLoadingUsers(false);
      }
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
