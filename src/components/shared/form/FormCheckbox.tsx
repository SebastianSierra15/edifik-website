interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Optional to customize additional styles
}

export function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  className = "rounded",
}: FormCheckboxProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-medium text-premium-textPrimary dark:text-premium-textPrimary cursor-pointer"
      >
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={className}
        />
        {label}
      </label>
    </div>
  );
}
