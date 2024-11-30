export function ProjectPlansSkeleton() {
  return (
    <div
      className="p-4 rounded-lg mt-8 animate-pulse"
      style={{
        backgroundColor: "transparent",
        border: "1px solid #5D4037",
      }}
    >
      {/* Skeleton Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>

      {/* Line Separator */}
      <hr
        className="w-full border-t-2 mb-4"
        style={{
          borderColor: "#5D4037",
        }}
      />

      {/* Content Skeleton */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
        {/* Skeleton Image */}
        <div
          className="w-full lg:w-2/3 h-64 bg-gray-300 rounded animate-pulse"
          style={{
            border: "1px solid #8B4513",
          }}
        ></div>

        {/* Skeleton Details */}
        <div className="w-full lg:w-1/3 space-y-4">
          {/* Skeleton Plan Title */}
          <div className="h-8 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>

          {/* Skeleton Plan Text Lines */}
          <div className="h-4 w-full bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
