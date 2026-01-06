"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { Info } from "lucide-react";

interface ModalAlertProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAlert({
  title,
  message,
  isOpen,
  onClose,
}: ModalAlertProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={clsx(
          "transform transition-transform duration-300 w-96 rounded-lg bg-premium-backgroundAlt p-6 shadow-lg dark:bg-premium-backgroundDark",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <Info className="h-10 w-10 text-premium-primary dark:text-premium-primaryLight" />

          <h2 className="mb-2 mt-4 text-lg font-semibold text-premium-textPrimary dark:text-premium-textSecondary">
            {title}
          </h2>

          <p className="mb-6 text-sm text-premium-textSecondary dark:text-premium-textPlaceholder">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full rounded-md bg-premium-primary py-2 text-white transition hover:bg-premium-primaryDark dark:bg-premium-primary dark:hover:bg-premium-primaryDark"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
