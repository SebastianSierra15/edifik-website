import React from "react";
import clsx from "clsx";
import type { Header } from "@/src/interfaces";
import { ChevronsUpDown } from "lucide-react";

interface TableHeaderProps<T> {
  headers: Header<T>[];
  sortState: { column: keyof T | null; direction: "asc" | "desc" | null };
  handleSort: (columnKey: keyof T | string) => void;
}

export function TableHeader<T>({
  headers,
  sortState,
  handleSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="thead-light text-xs">
      <tr>
        {headers.map(({ label, key }) => {
          const chevronsUpDownClass = clsx(
            "w-5 h-5 flex-shrink-0 transition-colors",
            sortState.column === key
              ? "text-premium-primary dark:text-premium-primary"
              : "text-premium-textPlaceholder dark:text-premium-textSecondary"
          );

          return (
            <th
              key={key as string}
              className="cursor-pointer px-4 py-2 text-center text-premium-textPrimary dark:text-premium-textPrimary"
              onClick={() => handleSort(key)}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-bold">{label.toUpperCase()}</span>
                <ChevronsUpDown className={chevronsUpDownClass} />
              </div>
            </th>
          );
        })}
        <th className="px-4 py-2 text-center text-sm font-bold text-premium-textPrimary dark:text-premium-textPrimary">
          ACCIÓN
        </th>
      </tr>
    </thead>
  );
}
