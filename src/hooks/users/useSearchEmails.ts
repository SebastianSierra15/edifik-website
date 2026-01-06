import { useState, useCallback } from "react";
import { UserEmail } from "@/src/interfaces";
import { UserService } from "@/src/services/users";

export function useSearchEmails() {
  const [emails, setEmails] = useState<UserEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setEmails([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await UserService.searchEmails(searchTerm);
      setEmails(result);
    } catch (err) {
      console.error("Error al buscar emails:", err);
      setError("Error al obtener los correos electrónicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    emails,
    loading,
    error,
    fetchEmails,
  };
}
