export default function ProjectHeaderSkeleton() {
  return (
    <div className="w-full animate-pulse px-4 pt-28 sm:px-6 lg:px-12 lg:pt-24">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-56 rounded-md bg-gray-300"></div>
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
          <div className="mt-2 flex flex-col sm:mt-0 lg:items-end lg:justify-start">
            <div className="h-8 w-32 rounded-md bg-gray-300"></div>
          </div>
        </div>

        <div className="lg:mt-2 lg:grid lg:grid-cols-2 lg:items-start lg:gap-2">
          <div className="flex flex-col text-lg lg:flex-row lg:items-center lg:space-x-2">
            <div className="flex items-center">
              <div className="h-6 w-48 rounded-md bg-gray-300"></div>
            </div>
            <div className="hidden h-6 w-2 rounded-md bg-gray-300 lg:inline"></div>
            <div className="mt-2 h-6 w-48 rounded-md bg-gray-300 pl-4 font-semibold lg:pl-0"></div>
          </div>

          <div className="hidden items-center text-sm lg:ml-auto lg:mt-0 lg:flex">
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            <div className="ml-2 h-6 w-48 rounded-md bg-gray-300"></div>
          </div>
        </div>

        <div className="flex items-center text-sm lg:hidden">
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
          <div className="ml-2 h-6 w-48 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
