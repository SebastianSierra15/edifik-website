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
      <div className="relative bg-backgroundAlt dark:bg-backgroundDarkAlt rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Close Icon */}
        <button
          className="absolute top-3 right-3 text-textPrimary dark:text-textSecondary hover:text-primary dark:hover:text-primaryLight"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4 text-primary dark:text-primaryLight">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-textPrimary dark:text-textSecondary text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-textSecondary dark:text-gray-400 text-center mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-md bg-secondary dark:bg-secondaryDark text-white hover:bg-secondaryLight dark:hover:bg-secondary hover:opacity-90 transition"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            className="px-4 py-2 rounded-md bg-primary dark:bg-primary text-white hover:bg-primaryDark dark:hover:bg-primaryDark transition"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
