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
        className="flex items-center justify-between w-full cursor-pointer rounded-md border border-client-accent px-3 py-2 text-client-textSecondary"
      >
        <span>{label}</span>

        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-client-primaryLight transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-client-accent checked:after:translate-x-6"
        />
      </label>
    </>
  );
}
