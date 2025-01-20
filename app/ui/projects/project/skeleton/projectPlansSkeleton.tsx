export function ProjectPlansSkeleton() {
  return (
    <div
      className="mt-8 animate-pulse rounded-lg p-4"
      style={{
        backgroundColor: "transparent",
        border: "1px solid #5D4037",
      }}
    >
      {/* Skeleton Title */}
      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-300"></div>

      {/* Line Separator */}
      <hr
        className="mb-4 w-full border-t-2"
        style={{
          borderColor: "#5D4037",
        }}
      />

      {/* Content Skeleton */}
      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:space-x-8 lg:space-y-0">
        {/* Skeleton Image */}
        <div
          className="h-64 w-full animate-pulse rounded bg-gray-300 lg:w-2/3"
          style={{
            border: "1px solid #8B4513",
          }}
        ></div>

        {/* Skeleton Details */}
        <div className="w-full space-y-4 lg:w-1/3">
          {/* Skeleton Plan Title */}
          <div className="mb-4 h-8 w-1/3 animate-pulse rounded bg-gray-300"></div>

          {/* Skeleton Plan Text Lines */}
          <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-300"></div>
          <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
