import { formatNumber } from "@/utils/formatters";
import { Info } from "lucide-react";

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  flag?: boolean;
}

export default function FormInput({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
  flag,
}: FormInputProps) {
  const formattedValue =
    type === "number" && typeof value === "number"
      ? formatNumber(value)
      : value;

  return (
    <div>
      <label className="mb-2 text-sm font-medium text-premium-textPrimary dark:text-premium-textPrimary">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formattedValue}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
          error && !flag
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        }`}
      />
      {error && !flag && (
        <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
          <Info className="size-6" />
          {error}
        </div>
      )}
    </div>
  );
}
