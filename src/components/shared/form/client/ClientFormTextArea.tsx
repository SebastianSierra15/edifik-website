import clsx from "clsx";
import { ClientTooltipIcon } from "./ClientTooltipIcon";
import { ClientFormErrorMessage } from "./ClientFormErrorMessage";

interface ClientFormTextAreaProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
  rows?: number;
  maxLength?: number;
  isEdit?: boolean;
  isAccent?: boolean;
}

export function ClientFormTextArea({
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  flag,
  tooltipText,
  rows = 4,
  maxLength,
  isEdit = true,
  isAccent = false,
}: ClientFormTextAreaProps) {
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={!isEdit}
        className={clsx(
          "w-full rounded-md border bg-client-backgroundLight px-3 py-2 text-client-text placeholder-client-textPlaceholder focus:outline-none",
          error && !flag && "border-red-500",
          isAccent
            ? "border-client-accent focus:border-client-accentHover"
            : "border-client-secondaryLight focus:border-client-secondaryHover"
        )}
      />

      {error && !flag && <ClientFormErrorMessage error={error} />}
    </div>
  );
}
