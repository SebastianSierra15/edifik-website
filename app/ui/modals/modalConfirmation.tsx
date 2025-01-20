import { useEffect } from "react";
import { CircleCheck, X } from "lucide-react";

type ModalConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ModalConfirmationProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-premium-backgroundDarkAlt relative w-full max-w-sm rounded-lg bg-premium-backgroundAlt p-6 shadow-lg">
        <button
          className="absolute right-3 top-3 text-premium-textPrimary hover:text-premium-primary dark:text-premium-textSecondary dark:hover:text-premium-primaryLight"
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
            className="rounded-md bg-premium-secondary px-4 py-2 text-white transition hover:bg-premium-secondaryLight hover:opacity-90 dark:bg-premium-secondaryDark dark:hover:bg-premium-secondary"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            className="rounded-md bg-premium-primary px-4 py-2 text-white transition hover:bg-premium-primaryDark dark:bg-premium-primary dark:hover:bg-premium-primaryDark"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
