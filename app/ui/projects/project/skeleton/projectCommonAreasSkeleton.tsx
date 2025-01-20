export function ProjectCommonAreasSkeleton() {
  return (
    <div className="my-8 w-full lg:w-2/3">
      {/* Skeleton Title */}
      <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-300"></div>

      {/* Skeleton Accordion Headers */}
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="mb-4 animate-pulse rounded-lg bg-white p-4 shadow"
            style={{
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Skeleton Accordion Header */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 rounded bg-gray-300"></div>
              <div className="h-4 w-6 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
    </div>
  );
}
