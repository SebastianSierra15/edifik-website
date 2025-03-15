export default function FilterSkeleton() {
  return (
    <div className="w-full rounded-lg bg-client-background py-4 shadow-md transition-all duration-300 ease-in-out sm:w-72 md:w-80 animate-pulse">
      <div className="mt-1 space-y-6">
        <div className="flex items-center justify-between rounded-md pl-2 pr-6">
          <div className="w-24 h-6 bg-client-secondary-light rounded" />
          <div className="w-8 h-8 bg-client-secondary-light rounded-full" />
        </div>

        <hr className="border-client-secondary" />

        <div className="space-y-4 overflow-x-hidden px-3 py-1 sm:max-h-[65vh] sm:overflow-y-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-client-secondary-light rounded-full" />
              <div className="w-32 h-5 bg-client-secondary-light rounded" />
            </div>
          ))}

          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-client-secondary-light rounded-full" />
                <div className="w-32 h-5 bg-client-secondary-light rounded" />
              </div>
              <div className="w-full h-3 bg-client-secondary-light rounded" />
            </div>
          ))}

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-client-secondary-light rounded-full" />
                <div className="w-32 h-5 bg-client-secondary-light rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-client-secondary-light rounded-full" />
                <div className="w-8 h-8 bg-client-secondary-light rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
