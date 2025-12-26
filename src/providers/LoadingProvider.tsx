"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Loader } from "@/src/components/shared";

interface LoadingContextValue {
  showLoader: () => void;
  hideLoader: () => void;
  setLoaderMessage: (message?: string) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [activeCount, setActiveCount] = useState(0);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoader = useCallback(() => {
    setActiveCount((count) => count + 1);
  }, []);

  const hideLoader = useCallback(() => {
    setActiveCount((count) => {
      const nextCount = Math.max(0, count - 1);
      if (nextCount === 0) {
        setMessage(undefined);
      }
      return nextCount;
    });
  }, []);

  const setLoaderMessage = useCallback((nextMessage?: string) => {
    setMessage(nextMessage);
  }, []);

  const isLoading = activeCount > 0;

  return (
    <LoadingContext.Provider
      value={{ showLoader, hideLoader, setLoaderMessage, isLoading }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Loader size={48} message={message} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading debe utilizarse dentro de LoadingProvider");
  }
  return context;
}
