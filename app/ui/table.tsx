import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/lib/definitios";
import { mergeSort } from "@/utils/mergeSort";
import { formatNumber } from "@/utils/formatters";

const FaTrash = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaTrash)
);
const FaEdit = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaEdit)
);
const FaChevronLeft = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaChevronLeft)
);
const FaChevronRight = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaChevronRight)
);
const FaSortUp = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaSortUp)
);
const FaSortDown = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaSortDown)
);

type TableProps<T extends Record<string, any>> = {
  data: T[];
  headers: Header<T>[];
  totalEntries: number;
  entry: string;
  stateLabels?: { true: string; false: string };
  currentPage: number;
  totalPages: number;
  goToPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  entriesPerPage: number;
  handleEntriesPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canDelete: boolean;
  onEditClick: (item: T) => void;
};

export default function Table<T extends { id?: number }>({
  data,
  headers,
  totalEntries,
  entry,
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  entriesPerPage,
  handleEntriesPerPageChange,
  handleSearchChange,
  canDelete,
  onEditClick,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<{
    column: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    column: null,
    direction: null,
  });

  const handleSort = (columnKey: keyof T) => {
    setSortState((prev) => ({
      column: columnKey,
      direction:
        prev.column === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data;
    return mergeSort(data, sortState.column, sortState.direction);
  }, [data, sortState]);

  return (
    <div className="px-4 lg:px-8 py-5 bg-premium-backgroundLight dark:bg-premium-secondaryLight rounded-3xl lg:mx-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 sm:items-center mb-4 md:px-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 px-2 sm:px-0">
          <span className="text-premium-textPrimary dark:text-premium-textPrimary">
            Mostrar
          </span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="border border-premium-borderColor dark:border-premium-borderColorHover focus:border-premium-borderColorHover dark:focus:border-premium-borderColorHover rounded-md px-2 py-1 focus:outline-none bg-premium-background dark:bg-premium-backgroundDark text-premium-textPrimary dark:text-premium-textPrimary"
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
            type="text"
            max={100}
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="border border-premium-borderColor dark:border-premium-borderColorHover focus:border-premium-borderColorHover dark:focus:border-premium-borderColorHover rounded-md px-3 py-2 w-full sm:w-auto focus:outline-none bg-premium-background dark:bg-premium-backgroundDark text-premium-textPrimary dark:text-premium-textPrimary"
          />
        </div>
      </div>

      <div className="table-responsive overflow-x-auto">
        <table className="table table-flush text-sm">
          <thead className="thead-light text-xs">
            <tr>
              {headers.map(({ label, key }) => (
                <th
                  key={key as string}
                  className="py-2 px-4 text-left cursor-pointer text-premium-textPrimary dark:text-premium-textPrimary"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center">
                    {label.toUpperCase()}
                    <div className="ml-2 flex flex-col gap-0">
                      <FaSortUp
                        className={`hover:text-premium-primary dark:hover:text-premium-primaryDark ${
                          sortState.column === key &&
                          sortState.direction === "asc"
                            ? "text-premium-primary dark:text-premium-primary"
                            : "text-premium-textPlaceholder dark:text-premium-textSecondary"
                        }`}
                      />
                      <FaSortDown
                        className={`hover:text-premium-primary dark:hover:text-premium-primaryDark ${
                          sortState.column === key &&
                          sortState.direction === "desc"
                            ? "text-premium-primary dark:text-premium-primary"
                            : "text-premium-textPlaceholder dark:text-premium-textSecondary"
                        }`}
                      />
                    </div>
                  </div>
                </th>
              ))}
              <th className="py-2 px-4 text-left text-premium-textPrimary dark:text-premium-textPrimary">
                ACCIÓN
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className="border-t border-premium-borderColor dark:border-premium-borderColorHover h-16 max-h-28 hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark"
              >
                {headers.map(({ key }, index) => (
                  <td
                    key={index}
                    className="py-2 px-4 text-premium-textPrimary dark:text-premium-textPrimary"
                  >
                    {(() => {
                      const columnType = headers.find(
                        (h) => h.key === key
                      )?.type;

                      if (columnType === "boolean") {
                        return (
                          <span
                            className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${
                              item[key]
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {item[key] ? "Activo" : "Inactivo"}
                          </span>
                        );
                      }

                      if (columnType === "number") {
                        return String(formatNumber(item[key] as number));
                      }

                      if (columnType === "string") {
                        return String(item[key]);
                      }

                      if (columnType === "date") {
                        const dateValue = item[key] as string | number;
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

                      return String(item[key] ?? "");
                    })()}
                  </td>
                ))}
                <td className="py-2 px-4 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => onEditClick(item)}
                    className="text-blue-500 hover:text-blue-600 shadow-md transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  {canDelete && (
                    <button className="text-red-500 hover:text-red-700 shadow-md transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm mt-4 md:px-3 text-premium-textPrimary dark:text-premium-textPrimary">
        <span>
          Mostrando {currentPage * entriesPerPage - entriesPerPage + 1} a{" "}
          {Math.min(currentPage * entriesPerPage, totalEntries)} de{" "}
          {totalEntries} {entry}
        </span>

        <div className="flex space-x-2 items-center">
          <button
            onClick={goToPreviousPage}
            className={`${
              currentPage === 1
                ? "text-premium-textPlaceholder"
                : "text-premium-primary dark:text-premium-primaryLight"
            } p-2 rounded-full border border-premium-borderColor dark:border-premium-borderColorHover focus:outline-none`}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
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
                  className={`px-3 py-1 rounded-full transition-colors duration-300 ${
                    currentPage === pageNumber
                      ? "bg-premium-primaryLight dark:bg-premium-primary hover:bg-premium-primary dark:hover:bg-premium-primaryDark text-white"
                      : "bg-premium-backgroundLight dark:bg-premium-backgroundDark hover:bg-premium-primaryLight dark:hover:bg-premium-primary text-premium-textPrimary dark:text-premium-textPrimary"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          <button
            onClick={goToNextPage}
            className={`${
              currentPage === totalPages
                ? "text-premium-textPlaceholder"
                : "text-premium-primary dark:text-premium-primaryLight"
            } p-2 rounded-full border border-premium-borderColor dark:border-premium-borderColorHover focus:outline-none`}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
