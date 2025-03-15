import { useState } from "react";
import { Membership } from "@/lib/definitios";

export const useMembershipUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateMembership = async (membership: Membership): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/memberships", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membership),
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al actualizar la membresía");
      }

      return true;
    } catch (error: any) {
      console.error("Error al actualizar la membresía:", error.message);
      setUpdateError(error.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateMembership, isUpdating, updateError };
};
