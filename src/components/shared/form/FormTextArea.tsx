import clsx from "clsx";
import { TooltipIcon } from "./TooltipIcon";
import FormErrorMessage from "../../../../app/ui/modals/formErrorMessage";

interface FormTextareaProps {
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
}

export function FormTextarea({
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
  isEdit,
}: FormTextareaProps) {
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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={isEdit}
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary",
          error && !flag && "border-red-500 bg-red-50",
          !error &&
            "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
      />
      {error && !flag && <FormErrorMessage error={error} />}
    </div>
  );
}
