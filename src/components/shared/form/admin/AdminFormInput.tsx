import clsx from "clsx";
import { formatNumber } from "@/utils/formatters";
import { AdminTooltipIcon } from "./AdminTooltipIcon";
import { AdminFormErrorMessage } from "./AdminFormErrorMessage";

interface AdminFormInputProps {
  id?: string;
  label: string;
  type: string;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  min?: number;
  max?: number;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
  isEdit?: boolean;
}

export function AdminFormInput({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  name,
  maxLength,
  min,
  max,
  error,
  flag,
  tooltipText,
  isEdit = true,
}: AdminFormInputProps) {
  const formattedValue =
    type === "number" && typeof value === "number"
      ? formatNumber(value)
      : value;

  return (
    <div>
      <label
        htmlFor={id ? id : name}
        className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary"
      >
        {label}
        {error !== undefined && " *"}
        {tooltipText && <AdminTooltipIcon tooltipText={tooltipText} />}
      </label>
      <input
        id={id ? id : name}
        type={type}
        name={name}
        value={formattedValue}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={type === "text" ? maxLength : undefined}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        disabled={!isEdit}
        autoComplete={
          type === "email"
            ? "email"
            : type === "password"
              ? "current-password"
              : "off"
        }
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary",
          error && !flag
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
      />
      {error && !flag && <AdminFormErrorMessage error={error} />}
    </div>
  );
}
