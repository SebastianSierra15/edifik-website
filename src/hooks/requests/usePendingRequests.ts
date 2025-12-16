import { useEffect, useState } from "react";
import { PendingRequest } from "@/src/interfaces";

export function usePendingRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource("/api/requests/stream");

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === "pendingRequests") {
        setRequests(payload.data);
      }
    };

    eventSource.onerror = () => {
      console.error("⚠️ Error en SSE de requests");
      eventSource.close();
    };

    setIsLoadingRequests(false);

    return () => {
      eventSource.close();
    };
  }, []);

  return {
    requests,
    isLoadingRequests,
  };
}
