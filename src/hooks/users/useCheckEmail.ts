import { useCallback, useState } from "react";
import { UserService } from "@/src/services/users";

export function useCheckEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkEmailExists = useCallback(
    async (email: string): Promise<number | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await UserService.checkEmail(email);
        return result.id;
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

  return {
    checkEmailExists,
    loading,
    error,
  };
}
