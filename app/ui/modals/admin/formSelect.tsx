import clsx from "clsx";
import TooltipIcon from "./tooltipIcon";
import FormErrorMessage from "../formErrorMessage";

interface FormSelectProps {
  label: string;
  name: string;
  value: string | number;
  options: { id: number | string; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
}

export default function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  error,
  flag,
  tooltipText,
}: FormSelectProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary"
      >
        {label}
        {error !== undefined && " *"}
        {tooltipText && <TooltipIcon tooltipText={tooltipText} />}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary",
          error && !flag
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
      >
        <option value="">Seleccione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id.toString()}>
            {option.name}
          </option>
        ))}
      </select>
      {error && !flag && <FormErrorMessage error={error} />}
    </div>
  );
}
