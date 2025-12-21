import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import { TooltipIcon } from "./TooltipIcon";
import { FormErrorMessage } from "./FormErrorMessage";

interface FormDatePickerProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
  dateMin?: Date;
  dateMax?: Date;
}

export function FormDatePicker({
  label,
  name,
  value,
  onChange,
  error,
  flag,
  tooltipText,
  dateMin,
  dateMax,
}: FormDatePickerProps) {
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

      <DatePicker
        id={name}
        name={name}
        selected={value}
        onChange={onChange}
        showMonthYearPicker
        minDate={dateMin || new Date()}
        maxDate={dateMax}
        dateFormat="MM/yyyy"
        placeholderText="mm/yyyy"
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary",
          error && !flag
            ? "border-red-500"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
        wrapperClassName="w-full"
      />
      {error && !flag && <FormErrorMessage error={error} />}
    </div>
  );
}
