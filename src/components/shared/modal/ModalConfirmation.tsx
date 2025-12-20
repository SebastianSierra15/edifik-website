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

export function ModalConfirmation({
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

  const handleConfirm = () => {
    setIsConfirming(true);
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-premium-backgroundDarkAlt relative w-full max-w-sm rounded-lg bg-premium-backgroundAlt p-6 shadow-lg">
        <button
          disabled={isConfirming}
          className="absolute right-3 top-3 text-premium-textPrimary hover:text-premium-primary dark:text-premium-textSecondary dark:hover:text-premium-primaryLight disabled:opacity-50"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex justify-center text-premium-primary dark:text-premium-primaryLight">
          <CircleCheck className="h-10 w-10 text-premium-primary" />
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold text-premium-textPrimary dark:text-premium-textSecondary">
          {title}
        </h3>

        <p className="mb-6 text-center text-sm text-premium-textSecondary dark:text-gray-400">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            disabled={isConfirming}
            className="rounded-md bg-premium-secondary px-4 py-2 text-white transition hover:bg-premium-secondaryLight hover:opacity-90 dark:bg-premium-secondaryDark dark:hover:bg-premium-secondary disabled:opacity-60"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            disabled={isConfirming}
            className={clsx(
              "rounded-md px-4 py-2 text-white transition disabled:opacity-60",
              confirmClassName ||
                "bg-premium-primary hover:bg-premium-primaryDark dark:bg-premium-primary dark:hover:bg-premium-primaryDark"
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
