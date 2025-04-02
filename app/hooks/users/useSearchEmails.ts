import { useState, useCallback } from "react";

interface EmailResult {
  id: number;
  email: string;
}

export function useSearchEmails() {
  const [emails, setEmails] = useState<EmailResult[]>([]);
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
      const response = await fetch(
        `/api/users/emails?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: EmailResult[] = await response.json();
      setEmails(data);
    } catch (err) {
      console.error("Error al buscar emails:", err);
      setError("Error al obtener los correos electrónicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { emails, loading, error, fetchEmails };
}
