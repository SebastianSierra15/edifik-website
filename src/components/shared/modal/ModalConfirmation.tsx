"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CircleCheck, X } from "lucide-react";

export type ConfirmationAction = "create" | "edit" | "delete";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  action?: ConfirmationAction;
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
  action,
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

  const actionStyles = {
    create: {
      icon: "text-green-500",
      title: "text-green-600 dark:text-green-400",
      confirmButton:
        "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700",
    },
    edit: {
      icon: "text-blue-500",
      title: "text-blue-600 dark:text-blue-400",
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
    },
    delete: {
      icon: "text-red-500",
      title: "text-red-600 dark:text-red-400",
      confirmButton:
        "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
    },
  };

  const actionStyle = action ? actionStyles[action] : null;
  const titleClassName = actionStyle
    ? actionStyle.title
    : "text-premium-textPrimary dark:text-premium-textSecondary";
  const iconClassName = actionStyle
    ? actionStyle.icon
    : "text-premium-primary dark:text-premium-primaryLight";
  const defaultConfirmClassName =
    actionStyle?.confirmButton ||
    "bg-premium-primary hover:bg-premium-primaryDark dark:bg-premium-primary dark:hover:bg-premium-primaryDark";

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

        <div className={clsx("mb-4 flex justify-center", iconClassName)}>
          <CircleCheck className="h-10 w-10" />
        </div>

        <h3
          className={clsx(
            "mb-2 text-center text-lg font-semibold",
            titleClassName
          )}
        >
          {title}
        </h3>

        <p className="mb-6 text-center text-sm text-premium-textSecondary dark:text-gray-400">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            disabled={isConfirming}
            className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600 hover:opacity-90 dark:bg-premium-secondaryDark dark:hover:bg-premium-secondary disabled:opacity-60"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            disabled={isConfirming}
            className={clsx(
              "rounded-md px-4 py-2 text-white transition disabled:opacity-60",
              confirmClassName || defaultConfirmClassName
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
