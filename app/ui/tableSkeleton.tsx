type TableSkeletonProps = {
  rows: number;
  columns: number;
};

export default function TableSkeleton({ rows, columns }: TableSkeletonProps) {
  return (
    <div className="animate-pulse px-4 lg:px-8 py-5 bg-premium-backgroundLight dark:bg-premium-secondaryLight rounded-3xl lg:mx-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 sm:items-center mb-4 md:px-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 px-2 sm:px-0">
          <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="relative w-48">
          <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      <div className="table-responsive overflow-x-auto w-full">
        <table className="table table-flush text-sm w-full">
          <thead className="thead-light text-xs">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="py-2 px-4 text-left text-premium-textPrimary dark:text-premium-textPrimary"
                >
                  <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                </th>
              ))}
              <th className="py-2 px-4 text-left text-premium-textPrimary dark:text-premium-textPrimary">
                <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-premium-borderColor dark:border-premium-borderColorHover hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark h-20"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="py-2 px-4">
                    <div className="w-full h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                  </td>
                ))}
                <td className="py-2 px-4 flex justify-center items-center">
                  <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm mt-4 md:px-3 text-premium-textPrimary dark:text-premium-textPrimary">
        <div className="w-64 h-4 bg-gray-300 dark:bg-gray-700 rounded" />

        <div className="flex space-x-2 items-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"
            />
          ))}
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
