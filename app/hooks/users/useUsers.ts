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
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch(
        `/api/users?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${encodeURIComponent(
          searchTerm
        )}`
      );

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch para obtener usuarios: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

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
