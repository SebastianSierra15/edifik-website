import { useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

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
  headers: { label: string; key: keyof T }[];
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
  T extends { id: number; price?: number; state?: boolean }
>({
  data,
  headers,
  totalEntries,
  entry,
  stateLabels = { true: "Activo", false: "Inactivo" },
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
      {/* Opciones de mostrar por página y campo de búsqueda */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 sm:items-center mb-4 md:px-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 px-2 sm:px-0">
          <span className="text-textPrimary dark:text-textPrimary">
            Mostrar
          </span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="border border-borderColor dark:border-borderColorHover focus:border-borderColorHover dark:focus:border-borderColorHover rounded-md px-2 py-1 focus:outline-none bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimary"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-textPrimary dark:text-textPrimary">
            {entry} por página
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="border border-borderColor dark:border-borderColorHover focus:border-borderColorHover dark:focus:border-borderColorHover rounded-md px-3 py-2 w-full sm:w-auto focus:outline-none bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimary"
          />
        </div>
      </div>

      {/* Tabla dinámica */}
      <div className="table-responsive overflow-x-auto">
        <table className="table table-flush text-sm">
          <thead className="thead-light text-xs">
            <tr>
              {headers.map(({ label, key }) => (
                <th
                  key={key as string}
                  className="py-2 px-4 text-left cursor-pointer text-textPrimary dark:text-textPrimary"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center">
                    {label.toUpperCase()}
                    <div className="ml-2 flex flex-col gap-0">
                      <FaSortUp
                        className={`hover:text-primary dark:hover:text-primaryDark ${
                          sortColumn === key && sortDirection === "asc"
                            ? "text-primary dark:text-primary"
                            : "text-textPlaceholder dark:text-textSecondary"
                        }`}
                      />
                      <FaSortDown
                        className={`hover:text-primary dark:hover:text-primaryDark ${
                          sortColumn === key && sortDirection === "desc"
                            ? "text-primary dark:text-primary"
                            : "text-textPlaceholder dark:text-textSecondary"
                        }`}
                      />
                    </div>
                  </div>
                </th>
              ))}
              <th className="py-2 px-4 text-left text-textPrimary dark:text-textPrimary">
                ACCIÓN
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className="border-t border-borderColor dark:border-borderColorHover max-h-28 hover:bg-backgroundLight dark:hover:bg-backgroundDark"
              >
                {headers.map(({ key }, index) => (
                  <td
                    key={index}
                    className="py-2 px-4 text-textPrimary dark:text-textPrimary"
                  >
                    {typeof item[key] === "number" ? (
                      item[key]?.toLocaleString()
                    ) : typeof item[key] === "boolean" ? (
                      <span
                        className={`py-1 px-3 rounded-full text-white ${
                          item[key] ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {item[key] ? stateLabels.true : stateLabels.false}
                      </span>
                    ) : (
                      String(item[key] ?? "")
                    )}
                  </td>
                ))}
                <td className="py-2 px-4 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => onEditClick(item)}
                    className="text-primary dark:text-primaryLight hover:text-primaryDark dark:hover:text-primaryDark"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  {canDelete && (
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center text-sm mt-4 md:px-3 text-textPrimary dark:text-textPrimary">
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
                ? "text-textPlaceholder"
                : "text-primary dark:text-primaryLight"
            } p-2 rounded-full border border-borderColor dark:border-borderColorHover focus:outline-none`}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded-full transition-colors duration-300 ${
                currentPage === i + 1
                  ? "bg-primaryLight dark:bg-primary hover:bg-primary dark:hover:bg-primaryDark text-white"
                  : "bg-backgroundLight dark:bg-backgroundDark hover:bg-primaryLight dark:hover:bg-primary text-textPrimary dark:text-textPrimary"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            className={`${
              currentPage === totalPages
                ? "text-textPlaceholder"
                : "text-primary dark:text-primaryLight"
            } p-2 rounded-full border border-borderColor dark:border-borderColorHover focus:outline-none`}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}
