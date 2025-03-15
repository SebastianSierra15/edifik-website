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

      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/users", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch para procesar usuario: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

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
