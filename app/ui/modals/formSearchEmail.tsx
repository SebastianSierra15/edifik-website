"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import clsx from "clsx";
import { Mail } from "lucide-react";
import { useSearchEmails } from "@/app/hooks/users/useSearchEmails";
import TooltipIcon from "./tooltipIcon";
import FormErrorMessage from "./formErrorMessage";

interface FormSearchEmailProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (email: string, ownerId: number | undefined) => void;
  error?: string;
  tooltipText?: string;
}

export default function FormSearchEmail({
  label,
  value,
  onChange,
  onSelect,
  error,
  tooltipText,
}: FormSearchEmailProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { emails, loading, fetchEmails } = useSearchEmails();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      if (newValue !== value) {
        onSelect(newValue, undefined);
      }

      if (newValue.trim()) {
        fetchEmails(newValue);
        setIsListVisible(true);
      } else {
        setIsListVisible(false);
      }
    },
    [onChange, fetchEmails, value]
  );

  const handleSelect = (email: string, ownerId: number) => {
    onSelect(email, ownerId);
    setIsListVisible(false);
  };

  const filteredEmails = useMemo(() => emails, [emails]);

  return (
    <div>
      <label
        htmlFor="ownerEmail"
        className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary"
      >
        {label}
        {tooltipText && <TooltipIcon tooltipText={tooltipText} />}
      </label>

      <input
        id="ownerEmail"
        ref={inputRef}
        type="text"
        name="ownerEmail"
        value={value}
        onChange={handleInputChange}
        placeholder="Ingrese el correo del propietario"
        autoComplete="email"
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary focus:outline-none focus:ring-2 focus:ring-premium-primary",
          error
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
      />

      {isListVisible && filteredEmails.length > 0 && (
        <div className="relative">
          <ul
            ref={listRef}
            className="absolute z-10 w-full border border-premium-borderColor dark:border-premium-borderColorHover 
       bg-premium-background dark:bg-premium-backgroundLight rounded-md shadow-lg"
          >
            {loading ? (
              <li className="p-2 text-center text-premium-textPrimary dark:text-premium-textPrimary">
                Cargando...
              </li>
            ) : (
              filteredEmails.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelect(user.email, user.id)}
                  className="cursor-pointer flex items-center gap-2 p-2 text-premium-textPrimary dark:text-premium-textPrimary hover:bg-premium-secondaryLight dark:hover:bg-premium-secondaryDark 
                transition-colors rounded-md"
                >
                  <Mail className="h-4 w-4 text-premium-primary" />
                  {user.email}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      {error && <FormErrorMessage error={error} />}
    </div>
  );
}
