export default function ProjectHeaderSkeleton() {
  return (
    <div className="w-full pt-28 lg:pt-20 px-4 sm:px-6 lg:px-12 animate-pulse">
      <div className="flex flex-col gap-2">
        {/* Skeleton: Name, ShareButton and Price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-56 bg-gray-300 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex flex-col lg:items-end lg:justify-start mt-2 sm:mt-0">
            <div className="h-8 w-32 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Skeleton: Address, City and Date */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-2 lg:items-start lg:mt-2">
          {/* Dirección y Ciudad */}
          <div className="text-lg flex flex-col lg:flex-row lg:items-center lg:space-x-2">
            <div className="flex items-center">
              <div className="h-6 w-48 bg-gray-300 rounded-md"></div>
            </div>
            <div className="hidden lg:inline h-6 w-2 bg-gray-300 rounded-md"></div>
            <div className="font-semibold mt-2 lg:pl-0 pl-4 h-6 w-48 bg-gray-300 rounded-md"></div>
          </div>

          {/* Estimated delivery date */}
          <div className="hidden lg:flex items-center text-sm lg:mt-0 lg:ml-auto">
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="ml-2 h-6 w-48 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Skeleton: Date for small screens */}
        <div className="flex items-center text-sm lg:hidden">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="ml-2 h-6 w-48 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
