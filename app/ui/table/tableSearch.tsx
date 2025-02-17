interface TableSearchProps {
  entriesPerPage: number;
  handleEntriesPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  entry: string;
}

export default function TableSearch({
  entriesPerPage,
  handleEntriesPerPageChange,
  handleSearchChange,
  entry,
}: TableSearchProps) {
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
        <input
          name="search"
          type="text"
          maxLength={100}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary focus:border-premium-borderColorHover focus:outline-none sm:w-auto dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary dark:focus:border-premium-borderColorHover"
        />
      </div>
    </div>
  );
}
