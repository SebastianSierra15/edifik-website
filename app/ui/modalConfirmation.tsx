import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ModalConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: React.ReactNode;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  icon,
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
      <div className="relative bg-premium-backgroundAlt dark:bg-premium-backgroundDarkAlt rounded-lg shadow-lg p-6 max-w-sm w-full">
        <button
          className="absolute top-3 right-3 text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4 text-premium-primary dark:text-premium-primaryLight">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-premium-textPrimary dark:text-premium-textSecondary text-center mb-2">
          {title}
        </h3>

        <p className="text-sm text-premium-textSecondary dark:text-gray-400 text-center mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-md bg-premium-secondary dark:bg-premium-secondaryDark text-white hover:bg-premium-secondaryLight dark:hover:bg-premium-secondary hover:opacity-90 transition"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            className="px-4 py-2 rounded-md bg-premium-primary dark:bg-premium-primary text-white hover:bg-premium-primaryDark dark:hover:bg-premium-primaryDark transition"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
