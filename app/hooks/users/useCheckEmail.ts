import { useCallback, useState } from "react";

export function useCheckEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkEmailExists = useCallback(
    async (email: string): Promise<number | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/users/check-email?email=${encodeURIComponent(email)}`,
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

        const data = await response.json();
        return data?.id ?? null;
      } catch (err) {
        console.error("Error al verificar email:", err);
        setError("Error al verificar el correo electrónico.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { checkEmailExists, loading, error };
}
