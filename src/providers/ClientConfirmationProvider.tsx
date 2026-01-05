"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ClientModalConfirmation } from "@/src/components/shared";

interface ClientConfirmationPayload {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
}

interface ClientConfirmationContextValue {
  confirm: (payload: ClientConfirmationPayload) => Promise<boolean>;
}

const ClientConfirmationContext =
  createContext<ClientConfirmationContextValue | null>(null);

export function ClientConfirmationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [payload, setPayload] = useState<ClientConfirmationPayload | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = (data: ClientConfirmationPayload): Promise<boolean> => {
    setPayload(data);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const cleanup = () => {
    setPayload(null);
    setResolver(null);
  };

  const handleConfirm = () => {
    resolver?.(true);
    cleanup();
  };

  const handleCancel = () => {
    resolver?.(false);
    cleanup();
  };

  return (
    <ClientConfirmationContext.Provider value={{ confirm }}>
      {children}
      {payload && (
        <ClientModalConfirmation
          isOpen
          title={payload.title}
          message={payload.message}
          confirmLabel={payload.confirmLabel}
          cancelLabel={payload.cancelLabel}
          confirmClassName={payload.confirmClassName}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </ClientConfirmationContext.Provider>
  );
}

export function useClientConfirmation(): (
  payload: ClientConfirmationPayload
) => Promise<boolean> {
  const context = useContext(ClientConfirmationContext);
  if (!context) {
    throw new Error(
      "useClientConfirmation debe utilizarse dentro de ClientConfirmationProvider"
    );
  }
  return context.confirm;
}
