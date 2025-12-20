"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Alert } from "@src/components/shared";

export type AlertType = "success" | "warning" | "error" | "info";

interface AlertPayload {
  type: AlertType;
  message: string;
  duration?: number;
}

interface AlertContextValue {
  showAlert: (payload: AlertPayload) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertPayload | null>(null);

  const showAlert = (payload: AlertPayload) => {
    setAlert(payload);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe utilizarse dentro de AlertProvider");
  }
  return context;
}
