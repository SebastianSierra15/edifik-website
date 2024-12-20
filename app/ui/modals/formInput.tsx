interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function FormInput({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
}: FormInputProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
          error
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        }`}
      />
      {error && (
        <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
