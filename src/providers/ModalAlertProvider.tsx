"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ModalAlert } from "@/src/components/shared";

interface ModalAlertPayload {
  title: string;
  message: string;
}

interface ModalAlertContextValue {
  showModalAlert: (payload: ModalAlertPayload) => void;
}

const ModalAlertContext = createContext<ModalAlertContextValue | null>(null);

export function ModalAlertProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<ModalAlertPayload | null>(null);

  const showModalAlert = (data: ModalAlertPayload) => {
    setPayload(data);
  };

  const handleClose = () => {
    setPayload(null);
  };

  return (
    <ModalAlertContext.Provider value={{ showModalAlert }}>
      {children}
      {payload && (
        <ModalAlert
          title={payload.title}
          message={payload.message}
          isOpen
          onClose={handleClose}
        />
      )}
    </ModalAlertContext.Provider>
  );
}

export function useModalAlert(): ModalAlertContextValue {
  const context = useContext(ModalAlertContext);
  if (!context) {
    throw new Error(
      "useModalAlert debe utilizarse dentro de ModalAlertProvider"
    );
  }
  return context;
}
