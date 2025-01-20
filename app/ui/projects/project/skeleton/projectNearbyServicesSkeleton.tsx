export function ProjectNearbyServicesSkeleton() {
  return (
    <div className="my-8">
      {/* Skeleton Title */}
      <div className="mb-6 h-8 w-64 animate-pulse rounded bg-gray-300"></div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center space-x-4 rounded-lg border bg-gray-100 p-4"
              style={{
                borderColor: "#EDEDED",
              }}
            >
              {/* Icon Skeleton */}
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              {/* Text Skeleton */}
              <div className="flex flex-1 flex-col">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="h-6 w-1/2 rounded bg-gray-300"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
