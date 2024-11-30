export function ProjectCommonAreasSkeleton() {
  return (
    <div className="my-8 w-full lg:w-2/3">
      {/* Skeleton Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-4 animate-pulse"></div>

      {/* Skeleton Accordion Headers */}
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="mb-4 p-4 rounded-lg shadow bg-white animate-pulse"
            style={{
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Skeleton Accordion Header */}
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
    </div>
  );
}
