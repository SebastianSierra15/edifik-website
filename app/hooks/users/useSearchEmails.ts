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
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch(
        `/api/users/emails?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch para buscar emails: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

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
