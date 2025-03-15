import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/lib/definitios";
import { mergeSort } from "@/utils/mergeSort";
import TableHeader from "./tableHeader";
import TableRow from "./tableRow";
import TablePagination from "./tablePagination";
import TableSearch from "./tableSearch";

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
  onEditClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  actions?: {
    icon: React.ElementType;
    title: string;
    className: string;
    redirectUrl?: string | ((item: T) => string);
    openInNewTab?: boolean;
    onClick?: (item: T) => void;
  }[];
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
  onEditClick,
  onDeleteClick,
  actions,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<{
    column: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    column: null,
    direction: null,
  });

  const totalPages = useMemo(
    () => Math.ceil(totalEntries / entriesPerPage),
    [totalEntries, entriesPerPage]
  );

  const handleSort = useCallback((columnKey: keyof T | string) => {
    setSortState((prev) => {
      if (prev.column === columnKey) {
        if (prev.direction === "asc")
          return { column: columnKey as keyof T, direction: "desc" };
        if (prev.direction === "desc") return { column: null, direction: null };
      }
      return { column: columnKey as keyof T, direction: "asc" };
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data;
    return mergeSort(data, sortState.column, sortState.direction);
  }, [data, sortState]);

  return (
    <div className="rounded-3xl bg-premium-backgroundLight px-4 py-5 shadow-lg lg:px-8 dark:bg-premium-secondaryLight">
      <TableSearch
        entriesPerPage={entriesPerPage}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        handleSearchChange={handleSearchChange}
        entry={entry}
      />
      <div className="table-responsive overflow-x-auto">
        <table className="table-flush table text-sm w-full">
          <TableHeader
            headers={headers}
            sortState={sortState}
            handleSort={handleSort}
          />

          <tbody>
            {sortedData.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                headers={headers}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                actions={actions}
              />
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
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
        />
      </div>
    </div>
  );
}
