import { useState } from "react";
import { Membership } from "@/src/interfaces";
import { MembershipService } from "@/src/services/memberships";

export function useMembershipApi() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMembership = async (membership: Membership): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      await MembershipService.updateMembership(membership);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null;
      setError(message || "Error al actualizar la membresía");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateMembership,
    isUpdating,
    error,
  };
}
