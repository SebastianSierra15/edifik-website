import { useState, useEffect } from "react";
import { Request } from "@/lib/definitios";

export const usePendingRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource("/api/requests/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "newRequests") {
        setRequests(() => {
          return data.data;
        });
      }
    };

    eventSource.onerror = () => {
      console.error("⚠️ Error en SSE");
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
};
