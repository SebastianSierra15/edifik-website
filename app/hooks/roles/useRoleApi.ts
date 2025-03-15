import { useState } from "react";
import { Role } from "@/lib/definitios";

export const useRoleApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRole = async (
    role: Role,
    action: "register" | "edit" | "delete"
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      const method =
        action === "delete" ? "DELETE" : action === "edit" ? "PUT" : "POST";

      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/roles", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(role),
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al procesar el rol");
      }

      return true;
    } catch (err: any) {
      console.error("Error al procesar el rol:", err.message);
      setError(err.message || "Error desconocido");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitRole, isProcessing, error };
};
