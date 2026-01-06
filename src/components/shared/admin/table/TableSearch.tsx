"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";

interface TableSearchProps {
  entriesPerPage: number;
  handleEntriesPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearch: (value: string) => void;
  entry: string;
  searchValue: string;
  onClearSearch?: () => void;
}

export function TableSearch({
  entriesPerPage,
  handleEntriesPerPageChange,
  onSearch,
  entry,
  searchValue,
  onClearSearch,
}: TableSearchProps) {
  const [localValue, setLocalValue] = useState<string>(searchValue);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  return (
    <div className="mb-4 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:text-sm md:px-3">
      <div className="flex items-center space-x-2 px-2 sm:px-0">
        <span className="text-premium-textPrimary dark:text-premium-textPrimary">
          Mostrar
        </span>
        <select
          name="numberElements"
          value={entriesPerPage}
          onChange={handleEntriesPerPageChange}
          className="rounded-md border border-premium-borderColor bg-premium-background px-2 py-1 text-premium-textPrimary focus:border-premium-borderColorHover focus:outline-none dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary dark:focus:border-premium-borderColorHover"
        >
          {[5, 10, 15, 20, 30].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="text-premium-textPrimary dark:text-premium-textPrimary">
          {entry} por página
        </span>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-premium-textSecondary"
        />

        <input
          name="search"
          type="text"
          maxLength={100}
          value={localValue}
          onChange={(e) => {
            const value = e.target.value;
            setLocalValue(value);
            debouncedSearch(value);
          }}
          placeholder="Buscar..."
          className="w-full rounded-md border border-premium-borderColor bg-premium-background px-10 py-2 text-premium-textPrimary focus:border-premium-borderColorHover focus:outline-none sm:w-auto dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary dark:focus:border-premium-borderColorHover"
        />

        {searchValue.trim().length > 0 && (
          <button
            type="button"
            onClick={() => {
              debouncedSearch.cancel();
              setLocalValue("");
              onClearSearch?.();
              onSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-premium-textSecondary hover:text-premium-textPrimary transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
