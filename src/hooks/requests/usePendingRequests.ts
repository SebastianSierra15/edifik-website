import { useEffect, useRef, useState } from "react";
import { PendingRequest } from "@/src/interfaces";

export function usePendingRequests(isEnabled: boolean) {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const hasLoadedOnceRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const shouldConnect = isEnabled || !hasLoadedOnceRef.current;
    if (!shouldConnect) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsLoadingRequests(false);
      return;
    }

    if (!hasLoadedOnceRef.current) {
      setIsLoadingRequests(true);
    }

    const eventSource = new EventSource("/api/requests/stream");
    eventSourceRef.current = eventSource;
    const keepOpen = isEnabled;

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === "pendingRequests") {
        setRequests(payload.data);
        hasLoadedOnceRef.current = true;
        setIsLoadingRequests(false);
        if (!keepOpen) {
          eventSource.close();
          if (eventSourceRef.current === eventSource) {
            eventSourceRef.current = null;
          }
        }
      }
    };

    eventSource.onerror = () => {
      console.error("ƒsÿ‹÷? Error en SSE de requests");
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
      setIsLoadingRequests(false);
    };

    return () => {
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
    };
  }, [isEnabled]);

  return {
    requests,
    isLoadingRequests,
  };
}
