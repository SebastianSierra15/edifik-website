import { useState } from "react";
import { Membership } from "@/lib/definitios";

export const useMembershipUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateMembership = async (membership: Membership): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const response = await fetch("/api/memberships", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membership),
      });

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
