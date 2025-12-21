export function ProjectCardSkeleton() {
  return (
    <div className="transform rounded-lg bg-transparent transition-transform duration-300">
      <div className="relative h-[370px] max-w-xs cursor-pointer overflow-hidden rounded-lg shadow-md bg-gray-700">
        <div className="relative h-[80%] w-full animate-pulse bg-gray-600" />

        <div className="absolute left-2 top-2 h-6 w-20 animate-pulse rounded-full bg-gray-700" />

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent px-2 pb-2 pt-16">
          <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-600" />
          <div className="mb-1 h-3 w-1/2 animate-pulse rounded bg-gray-600" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-600" />
        </div>
      </div>
    </div>
  );
}
