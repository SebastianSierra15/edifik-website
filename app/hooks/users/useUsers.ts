import { useState, useEffect } from "react";
import { User, Role, Gender, MembershipSummary } from "@/lib/definitios";

export const useUsers = (
  currentPage: number,
  entriesPerPage: number,
  searchTerm: string
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [memberships, setMemberships] = useState<MembershipSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
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
        setRoles(data.roles);
        setGenders(data.genders);
        setMemberships(data.memberships);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, entriesPerPage, searchTerm]);

  return { users, roles, genders, memberships, totalEntries, isLoading };
};
