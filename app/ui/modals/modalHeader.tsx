interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-premium-borderColor dark:border-premium-borderColorHover py-3 px-6">
      <h5 className="text-xl font-semibold text-premium-primary dark:text-premium-primaryLight">
        {title}
      </h5>
      <button
        type="button"
        onClick={onClose}
        className="text-premium-secondary dark:text-premium-textPrimary hover:text-premium-primary text-3xl"
      >
        &times;
      </button>
    </div>
  );
}
