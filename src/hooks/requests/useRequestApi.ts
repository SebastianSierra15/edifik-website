import { useState } from "react";
import { RequestService } from "@/src/services/requests";

const STATUS_MAP = {
  approve: 2,
  reject: 3,
  revision: 4,
} as const;

export function useRequestApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRequest = async (
    requestId: number,
    action: keyof typeof STATUS_MAP,
    message: string,
    userEmail: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      await RequestService.processRequest({
        id: requestId,
        statusId: STATUS_MAP[action],
        responseMessage: message,
        userEmail,
      });

      return true;
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processRequest, isProcessing, error };
}
