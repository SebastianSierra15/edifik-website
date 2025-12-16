import { useState } from "react";
import { RoleWrite } from "@/src/interfaces";
import { RoleService } from "@/src/services";

export function useRoleApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRole = async (
    role: RoleWrite,
    action: "create" | "edit" | "delete"
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "delete" && role.id) {
        await RoleService.deleteRole(role.id);
      } else if (action === "edit") {
        await RoleService.updateRole(role);
      } else {
        await RoleService.createRole(role);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Error al procesar el rol");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitRole,
    isProcessing,
    error,
  };
}
