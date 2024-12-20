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
    <div className="flex justify-end p-4 border-t border-premium-borderColor dark:border-premium-borderColorHover">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-premium-textPlaceholder hover:bg-premium-borderColor dark:bg-premium-secondary dark:hover:bg-premium-secondaryLight text-white rounded-lg mr-2 hover:scale-105 transition transform duration-300"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        form={formId}
        className="px-4 py-2 bg-premium-primary hover:bg-premium-primaryDark dark:bg-premium-primaryLight dark:hover:bg-premium-primaryDark text-white rounded-lg hover:scale-105 transition transform duration-300"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
