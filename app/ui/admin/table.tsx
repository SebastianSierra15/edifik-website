import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { Header } from "@/lib/definitios";
import { mergeSort } from "@/utils/mergeSort";
import { formatNumber } from "@/utils/formatters";
import { getNestedValue } from "@/utils/getNestedValue";

const ChevronLeft = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronLeft)
);
const ChevronRight = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronRight)
);
const ChevronsUpDown = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronsUpDown)
);
const Edit = dynamic(() => import("lucide-react").then((mod) => mod.Edit));
const Trash2 = dynamic(() => import("lucide-react").then((mod) => mod.Trash2));

type TableProps<T extends Record<string, any>> = {
  data: T[];
  headers: Header<T>[];
  totalEntries: number;
  entry: string;
  stateLabels?: { true: string; false: string };
  currentPage: number;
  goToPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  entriesPerPage: number;
  handleEntriesPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canDelete: boolean;
  onEditClick: (item: T) => void;
  onDeleteClick?: (item: T) => void;
};

export default function Table<T extends { id?: number }>({
  data,
  headers,
  totalEntries,
  entry,
  currentPage,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  entriesPerPage,
  handleEntriesPerPageChange,
  handleSearchChange,
  canDelete,
  onEditClick,
  onDeleteClick,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<{
    column: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    column: null,
    direction: null,
  });

  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const handleSort = (columnKey: keyof T | string) => {
    setSortState((prev) => {
      const newColumn =
        typeof columnKey === "string"
          ? (columnKey as keyof T | null)
          : columnKey;

      return {
        column: newColumn,
        direction:
          prev.column === newColumn && prev.direction === "asc"
            ? "desc"
            : "asc",
      };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data;
    return mergeSort(data, sortState.column, sortState.direction);
  }, [data, sortState]);

  return (
    <div className="rounded-3xl bg-premium-backgroundLight px-4 py-5 shadow-lg lg:mx-4 lg:px-8 dark:bg-premium-secondaryLight">
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
          <input
            name="search"
            type="text"
            max={100}
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary focus:border-premium-borderColorHover focus:outline-none sm:w-auto dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary dark:focus:border-premium-borderColorHover"
          />
        </div>
      </div>

      <div className="table-responsive overflow-x-auto">
        <table className="table-flush table text-sm w-full">
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
                    className="cursor-pointer px-4 py-2 text-left text-premium-textPrimary dark:text-premium-textPrimary"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">
                        {label.toUpperCase()}
                      </span>
                      <ChevronsUpDown className={chevronsUpDownClass} />
                    </div>
                  </th>
                );
              })}

              <th className="px-4 py-2 text-center text-premium-textPrimary dark:text-premium-textPrimary">
                ACCIÓN
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className="h-16 max-h-28 border-t border-premium-borderColor hover:bg-premium-backgroundDark dark:border-premium-borderColorHover dark:hover:bg-premium-backgroundDark"
              >
                {headers.map(({ key, type, subKey }, index) => (
                  <td
                    key={index}
                    className="px-4 py-2 text-premium-textPrimary dark:text-premium-textPrimary"
                  >
                    {(() => {
                      const value =
                        typeof key === "string"
                          ? getNestedValue(item, key)
                          : item[key];

                      if (type === "array" && Array.isArray(value)) {
                        return (
                          <ul className="list-disc pl-5 text-premium-textSecondary dark:text-premium-textSecondary">
                            {value.map((subItem: any, i: number) => (
                              <li key={i}>
                                {subKey
                                  ? subItem[subKey]
                                  : JSON.stringify(subItem)}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      if (type === "boolean") {
                        return (
                          <span
                            className={clsx(
                              "inline-block rounded-full px-3 py-1 text-sm font-medium",
                              value
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            )}
                          >
                            {value ? "Activo" : "Inactivo"}
                          </span>
                        );
                      }

                      if (type === "number") {
                        return String(formatNumber(value as number));
                      }

                      if (type === "string") {
                        return String(value);
                      }

                      if (type === "date") {
                        const dateValue = value as string | number;
                        return new Date(dateValue).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        });
                      }

                      return String(value ?? "");
                    })()}
                  </td>
                ))}
                <td className="flex items-center justify-center space-x-2 px-4 py-2">
                  <button
                    onClick={() => onEditClick(item)}
                    className="text-blue-500 shadow-md transition-colors hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => onDeleteClick && onDeleteClick(item)}
                      className="text-red-500 shadow-md transition-colors hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-premium-textPrimary md:px-3 dark:text-premium-textPrimary">
        <span>
          Mostrando {currentPage * entriesPerPage - entriesPerPage + 1} a{" "}
          {Math.min(currentPage * entriesPerPage, totalEntries)} de{" "}
          {totalEntries} {entry}
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousPage}
            className={clsx(
              "rounded-full border p-2 focus:outline-none",
              "border-premium-borderColor dark:border-premium-borderColorHover",
              currentPage === 1
                ? "text-premium-textPlaceholder"
                : "text-premium-primary dark:text-premium-primaryLight"
            )}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from(
            {
              length: Math.min(window.innerWidth >= 768 ? 5 : 3, totalPages),
            },
            (_, i) => {
              const startPage = Math.max(
                1,
                Math.min(
                  currentPage -
                    Math.floor((window.innerWidth >= 768 ? 5 : 3) / 2),
                  totalPages - (window.innerWidth >= 768 ? 5 : 3) + 1
                )
              );
              const pageNumber = startPage + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={clsx(
                    "rounded-full px-3 py-1 transition-colors duration-300",
                    currentPage === pageNumber
                      ? "bg-premium-primaryLight text-white hover:bg-premium-primary dark:bg-premium-primary dark:hover:bg-premium-primaryDark"
                      : "bg-premium-backgroundLight text-premium-textPrimary hover:bg-premium-primaryLight dark:bg-premium-backgroundDark dark:text-premium-textPrimary dark:hover:bg-premium-primary"
                  )}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          <button
            onClick={goToNextPage}
            className={clsx(
              "rounded-full border p-2 focus:outline-none",
              "border-premium-borderColor dark:border-premium-borderColorHover",
              currentPage === totalPages
                ? "text-premium-textPlaceholder"
                : "text-premium-primary dark:text-premium-primaryLight"
            )}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
