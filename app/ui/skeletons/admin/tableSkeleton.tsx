export default function TableSkeleton() {
  const rows = 5;
  const columns = 8;

  return (
    <div className="animate-pulse rounded-3xl bg-premium-backgroundLight px-4 py-5 shadow-lg lg:mx-4 lg:px-8 dark:bg-premium-secondaryLight">
      <div className="mb-4 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:text-sm md:px-3">
        <div className="flex items-center space-x-2 px-2 sm:px-0">
          <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-12 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="relative w-48">
          <div className="h-8 w-full rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>

      <div className="table-responsive w-full overflow-x-auto">
        <table className="table-flush table w-full text-sm">
          <thead className="thead-light text-xs">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-center text-premium-textPrimary dark:text-premium-textPrimary"
                >
                  <div className="h-6 w-20 rounded bg-gray-300 dark:bg-gray-700 mx-auto" />
                </th>
              ))}
              <th className="px-4 py-2 text-center text-premium-textPrimary dark:text-premium-textPrimary">
                <div className="h-6 w-20 rounded bg-gray-300 dark:bg-gray-700 mx-auto" />
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="h-20 border-t border-premium-borderColor hover:bg-premium-backgroundLight dark:border-premium-borderColorHover dark:hover:bg-premium-backgroundDark"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <div className="h-6 w-full rounded bg-gray-300 dark:bg-gray-700" />
                  </td>
                ))}
                <td className="flex items-center justify-center px-4 py-2">
                  <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-premium-textPrimary md:px-3 dark:text-premium-textPrimary">
        <div className="h-4 w-64 rounded bg-gray-300 dark:bg-gray-700" />

        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700"
            />
          ))}
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
