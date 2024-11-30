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
        } bg-backgroundAlt dark:bg-backgroundDark rounded-lg shadow-lg w-96 p-6`}
      >
        <div className="flex flex-col items-center text-center">
          <AiOutlineInfoCircle className="text-primary dark:text-primaryLight text-3xl mb-4" />
          
          <h2 className="text-lg font-semibold text-textPrimary dark:text-textSecondary mb-2">
            {title}
          </h2>
          
          <p className="text-sm text-textSecondary dark:text-textPlaceholder mb-6">
            {message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="w-full bg-primary dark:bg-primary text-white py-2 rounded-md hover:bg-primaryDark dark:hover:bg-primaryDark transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
