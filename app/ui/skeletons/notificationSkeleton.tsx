export default function NotificationSkeleton() {
  return (
    <ul className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
          className="flex items-center space-x-4 animate-pulse bg-transparent px-3 py-2 rounded-md dark:bg-transparent"
        >
          <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />

          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>

          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
