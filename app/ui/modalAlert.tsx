"use client";

import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface ModalAlertProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAlert({
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
        className={`transform transition-transform duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } bg-premium-backgroundAlt dark:bg-premium-backgroundDark rounded-lg shadow-lg w-96 p-6`}
      >
        <div className="flex flex-col items-center text-center">
          <AiOutlineInfoCircle className="text-premium-primary dark:text-premium-primaryLight text-3xl mb-4" />

          <h2 className="text-lg font-semibold text-premium-textPrimary dark:text-premium-textSecondary mb-2">
            {title}
          </h2>

          <p className="text-sm text-premium-textSecondary dark:text-premium-textPlaceholder mb-6">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-premium-primary dark:bg-premium-primary text-white py-2 rounded-md hover:bg-premium-primaryDark dark:hover:bg-premium-primaryDark transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
