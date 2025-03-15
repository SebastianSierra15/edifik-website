interface FormCheckboxToggleProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FormCheckboxToggle({
  label,
  name,
  checked,
  onChange,
}: FormCheckboxToggleProps) {
  return (
    <>
      <label
        htmlFor={name}
        className="flex items-center justify-between w-full cursor-pointer rounded-md border border-premium-borderColor bg-premium-secondaryLight px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-secondaryDark dark:text-premium-textPrimary"
      >
        <span className="text-premium-textPrimary dark:text-premium-textSecondary">
          {label}
        </span>
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
        />
      </label>
    </>
  );
}
