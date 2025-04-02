import { useState } from "react";

export const useRequestApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRequest = async (
    requestId: number,
    action: "approve" | "reject" | "revision",
    message: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    if (!message.trim()) {
      setError("El mensaje de respuesta es obligatorio.");
      setIsProcessing(false);
      return false;
    }

    try {
      const statusId = action === "approve" ? 2 : action === "reject" ? 3 : 4;

      const response = await fetch(`/api/requests`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          statusId,
          responseMessage: message,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al procesar la solicitud");
      }

      return true;
    } catch (err: any) {
      console.error("Error al procesar la solicitud:", err.message);
      setError(err.message || "Error desconocido");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processRequest, isProcessing, error };
};
