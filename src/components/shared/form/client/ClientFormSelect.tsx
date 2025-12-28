import clsx from "clsx";
import { ClientTooltipIcon } from "./ClientTooltipIcon";
import { ClientFormErrorMessage } from "./ClientFormErrorMessage";

interface ClientFormSelectProps {
  label: string;
  name: string;
  value: string | number;
  options: { id: number | string; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
  isAccent?: boolean;
}

export function ClientFormSelect({
  label,
  name,
  value,
  options,
  onChange,
  error,
  flag,
  tooltipText,
  isAccent = false,
}: ClientFormSelectProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-client-text"
      >
        {label}
        {error !== undefined && " *"}
        {tooltipText && <ClientTooltipIcon tooltipText={tooltipText} />}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full rounded-md border bg-client-backgroundLight px-3 py-2 text-client-text placeholder-client-textPlaceholder focus:outline-none",
          error && !flag && "border-red-500",
          isAccent
            ? "border-client-accent focus:border-client-accentHover"
            : "border-client-secondaryLight focus:border-client-secondaryHover"
        )}
      >
        <option value="">Seleccione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id.toString()}>
            {option.name}
          </option>
        ))}
      </select>
      {error && !flag && <ClientFormErrorMessage error={error} />}
    </div>
  );
}
