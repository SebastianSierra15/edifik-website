interface ModalFooterProps {
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  formId?: string;
}

export default function ModalFooter({
  onClose,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  formId,
}: ModalFooterProps) {
  return (
    <div className="flex justify-end border-t border-premium-borderColor p-4 dark:border-premium-borderColorHover">
      <button
        type="button"
        onClick={onClose}
        className="mr-2 transform rounded-lg bg-premium-textPlaceholder px-4 py-2 text-white transition duration-300 hover:scale-105 hover:bg-premium-borderColor dark:bg-premium-secondary dark:hover:bg-premium-secondaryLight"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        form={formId}
        className="transform rounded-lg bg-premium-primary px-4 py-2 text-white transition duration-300 hover:scale-105 hover:bg-premium-primaryDark dark:bg-premium-primaryLight dark:hover:bg-premium-primaryDark"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
