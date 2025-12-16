import { useState } from "react";
import { UserProjectsService } from "@/src/services";

export function useUserProjectApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitUserProject = async (
    projectId: number,
    action: "delete"
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "delete") {
        await UserProjectsService.deleteProject(projectId);
      }
      return true;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitUserProject, isProcessing, error };
}
