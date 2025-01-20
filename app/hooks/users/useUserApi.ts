import { useState } from "react";
import { UserData } from "@/lib/definitios";

export const useUserApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitUser = async (
    user: UserData,
    action: "register" | "edit"
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      const method = action === "edit" ? "PUT" : "POST";

      const response = await fetch("/api/users", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al procesar el usuario");
      }

      return true;
    } catch (err: any) {
      console.error("Error al procesar el usuario:", err.message);
      setError(err.message || "Error desconocido");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitUser, isProcessing, error };
};
