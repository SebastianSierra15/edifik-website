export function ProjectDetailsSkeleton() {
  return (
    <div className="my-8">
      {/* Skeleton Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-6 animate-pulse"></div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-100 animate-pulse flex items-center space-x-4"
              style={{
                borderColor: "#EDEDED",
              }}
            >
              {/* Icon Skeleton */}
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              {/* Text Skeleton */}
              <div className="flex flex-col flex-1">
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
