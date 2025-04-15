import { useEffect, useState } from "react";
import clsx from "clsx";
import { CircleCheck, X } from "lucide-react";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
}

export default function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmClassName,
}: ModalConfirmationProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsConfirming(false);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirming(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-client-backgroundAlt relative w-full max-w-sm rounded-lg p-6 shadow-lg">
        <button
          className="absolute right-3 top-3 text-client-secondary hover:text-client-secondaryHover"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isConfirming}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex justify-center">
          <CircleCheck className="h-10 w-10 text-client-accent" />
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold text-client-text">
          {title}
        </h3>

        <p className="mb-6 text-center text-sm text-client-secondary">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            disabled={isConfirming}
            className="rounded-md bg-client-background px-4 py-2 text-white transition hover:bg-client-backgroundLight hover:opacity-90 disabled:opacity-60"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            disabled={isConfirming}
            className={clsx(
              "rounded-md px-4 py-2 text-white transition disabled:opacity-60",
              confirmClassName || "bg-client-accent hover:bg-client-accentHover"
            )}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
