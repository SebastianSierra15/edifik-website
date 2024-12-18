import { useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { Header } from "@/lib/definitios";

const mergeSort = <T,>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc"
): T[] => {
  if (array.length <= 1) return array;

  const middle = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, middle), key, direction);
  const right = mergeSort(array.slice(middle), key, direction);

  return merge(left, right, key, direction);
};

const merge = <T,>(
  left: T[],
  right: T[],
  key: keyof T,
  direction: "asc" | "desc"
): T[] => {
  const result: T[] = [];
  let indexLeft = 0;
  let indexRight = 0;

  while (indexLeft < left.length && indexRight < right.length) {
    const leftValue = left[indexLeft][key];
    const rightValue = right[indexRight][key];

    const comparison =
      typeof leftValue === "string"
        ? leftValue.localeCompare(rightValue as string)
        : (leftValue as number) - (rightValue as number);

    if (
      (direction === "asc" && comparison <= 0) ||
      (direction === "desc" && comparison > 0)
    ) {
      result.push(left[indexLeft++]);
    } else {
      result.push(right[indexRight++]);
    }
  }

  return result.concat(left.slice(indexLeft), right.slice(indexRight));
};

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

export default function Table<
  T extends { id?: number; price?: number; state?: boolean }
>({
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
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = (columnKey: keyof T) => {
    setSortColumn(columnKey);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const sortedData = sortColumn
    ? mergeSort(data, sortColumn, sortDirection || "asc")
    : data;

  return (
    <>
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
                          sortColumn === key && sortDirection === "asc"
                            ? "text-premium-primary dark:text-premium-primary"
                            : "text-premium-textPlaceholder dark:text-premium-textSecondary"
                        }`}
                      />
                      <FaSortDown
                        className={`hover:text-premium-primary dark:hover:text-premium-primaryDark ${
                          sortColumn === key && sortDirection === "desc"
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
                        return item[key]?.toLocaleString();
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
    </>
  );
}
