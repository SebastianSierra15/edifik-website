import { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { formatNumber } from "@/utils/formatters";
import TooltipIcon from "./tooltipIcon";
import FormErrorMessage from "../formErrorMessage";

interface FormInputProps {
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
  isAccent?: boolean;
}

export default function FormInput({
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
  isAccent = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formattedValue =
    type === "number" && typeof value === "number"
      ? formatNumber(value)
      : value;

  return (
    <div>
      <label
        htmlFor={id ? id : name}
        className="mb-2 flex items-center gap-2 text-client-text"
      >
        {label}
        {error && " *"}
        {tooltipText && <TooltipIcon tooltipText={tooltipText} />}
      </label>

      <div className="relative">
        <input
          id={id ? id : name}
          type={type === "password" && showPassword ? "text" : type}
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
            "w-full rounded-md border bg-client-backgroundLight px-3 py-2 text-client-text placeholder-client-textPlaceholder focus:outline-none",
            error && !flag && "border-red-500",
            isAccent
              ? "border-client-accent focus:border-x-client-accentHover"
              : "border-client-secondaryLight focus:border-client-secondaryHover"
          )}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-client-textSecondary"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && !flag && <FormErrorMessage error={error} />}
    </div>
  );
}
