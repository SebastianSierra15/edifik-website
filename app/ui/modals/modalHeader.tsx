interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-premium-borderColor px-6 py-3 dark:border-premium-borderColorHover">
      <h5 className="text-xl font-semibold text-premium-primary dark:text-premium-primaryLight">
        {title}
      </h5>
      <button
        type="button"
        onClick={onClose}
        className="text-3xl text-premium-secondary hover:text-premium-primary dark:text-premium-textPrimary"
      >
        &times;
      </button>
    </div>
  );
}
