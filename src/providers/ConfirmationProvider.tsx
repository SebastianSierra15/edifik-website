"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ModalConfirmation } from "@/src/components/shared";

interface ConfirmationPayload {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
}

interface ConfirmationContextValue {
  confirm: (payload: ConfirmationPayload) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(
  null
);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<ConfirmationPayload | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = (data: ConfirmationPayload): Promise<boolean> => {
    setPayload(data);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    cleanup();
  };

  const handleCancel = () => {
    resolver?.(false);
    cleanup();
  };

  const cleanup = () => {
    setPayload(null);
    setResolver(null);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {payload && (
        <ModalConfirmation
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
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation(): (
  payload: ConfirmationPayload
) => Promise<boolean> {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation debe utilizarse dentro de ConfirmationProvider"
    );
  }
  return context.confirm;
}
