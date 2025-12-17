import { useState } from "react";
import { ProjectService } from "@/src/services/projects";

export function useProjectApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProject = async (
    data: unknown,
    action: "create" | "edit" | "delete"
  ): Promise<number | boolean | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "create") {
        return await ProjectService.create(data);
      }

      if (action === "edit") {
        await ProjectService.update(data);
        return true;
      }

      if (action === "delete") {
        await ProjectService.delete(Number(data));
        return true;
      }

      return null;
    } catch (err: any) {
      setError(err.message || "Error al procesar el proyecto");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitProject, isProcessing, error };
}
