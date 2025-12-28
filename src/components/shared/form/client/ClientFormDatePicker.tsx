import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import { ClientTooltipIcon } from "./ClientTooltipIcon";
import { ClientFormErrorMessage } from "./ClientFormErrorMessage";

interface ClientFormDatePickerProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  flag?: boolean;
  tooltipText?: string;
  dateMin?: Date;
  dateMax?: Date;
  isAccent?: boolean;
}

export function ClientFormDatePicker({
  label,
  name,
  value,
  onChange,
  error,
  flag,
  tooltipText,
  dateMin,
  dateMax,
  isAccent = false,
}: ClientFormDatePickerProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-client-text"
      >
        {label}
        {error && " *"}
        {tooltipText && <ClientTooltipIcon tooltipText={tooltipText} />}
      </label>

      <DatePicker
        id={name}
        name={name}
        selected={value}
        onChange={onChange}
        minDate={dateMin || new Date()}
        maxDate={dateMax}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
        className={clsx(
          "w-full rounded-md border bg-client-backgroundLight px-3 py-2 text-client-text placeholder-client-textPlaceholder focus:outline-none",
          error && !flag && "border-red-500",
          isAccent
            ? "border-client-accent focus:border-client-accentHover"
            : "border-client-secondaryLight focus:border-client-secondaryHover"
        )}
        wrapperClassName="w-full"
      />
      {error && !flag && <ClientFormErrorMessage error={error} />}
    </div>
  );
}
