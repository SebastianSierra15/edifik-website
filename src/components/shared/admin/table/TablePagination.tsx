import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (pageNumber: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  goToPage,
  goToPreviousPage,
  goToNextPage,
}: TablePaginationProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={clsx(
          "rounded-full border p-2 focus:outline-none transition-colors",
          "border-premium-borderColor dark:border-premium-borderColorHover",
          currentPage === 1
            ? "text-premium-textPlaceholder cursor-not-allowed"
            : "text-premium-primary dark:text-premium-primaryLight hover:bg-premium-primaryLight dark:hover:bg-premium-primaryDark hover:text-white"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const startPage = Math.max(
          1,
          Math.min(currentPage - 2, totalPages - 4)
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
      })}

      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={clsx(
          "rounded-full border p-2 focus:outline-none transition-colors",
          "border-premium-borderColor dark:border-premium-borderColorHover",
          currentPage === totalPages
            ? "text-premium-textPlaceholder cursor-not-allowed"
            : "text-premium-primary dark:text-premium-primaryLight hover:bg-premium-primaryLight dark:hover:bg-premium-primaryDark hover:text-white"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
