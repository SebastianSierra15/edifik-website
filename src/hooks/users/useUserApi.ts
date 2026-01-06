import { useState } from "react";
import { UserWrite } from "@/src/interfaces";
import { UserService } from "@/src/services/users";

export const useUserApi = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitUser = async (
    user: UserWrite,
    action: "register" | "edit"
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "edit") {
        await UserService.updateUser(user);
      } else {
        await UserService.createUser(user);
      }

      return true;
    } catch (err: unknown) {
      console.error("Error al procesar el usuario:", err);
      const message = err instanceof Error ? err.message : null;
      setError(message || "Error desconocido");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitUser,
    isProcessing,
    error,
  };
};
