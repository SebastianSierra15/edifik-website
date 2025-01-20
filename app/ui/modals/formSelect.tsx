import { Info } from "lucide-react";

interface FormSelectProps {
  label: string;
  name: string;
  value: string | number;
  options: { id: number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  flag?: boolean;
}

export default function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  error,
  flag,
}: FormSelectProps) {
  return (
    <div>
      <label className="mb-2 text-sm font-medium text-premium-textPrimary dark:text-premium-textPrimary">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
          error && !flag
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        }`}
      >
        <option value="">Seleccione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && !flag && (
        <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
          <Info className="size-6" />
          {error}
        </div>
      )}
    </div>
  );
}
