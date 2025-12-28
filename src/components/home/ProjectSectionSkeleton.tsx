import clsx from "clsx";

export function ProjectSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={clsx(
            "bg-client-background-alt py-2 rounded-lg",
            index === 0 && "sm:col-span-2 md:col-span-1",
            index === 1 && "lg:col-span-2"
          )}
        >
          <div className="relative w-full h-80 rounded-lg bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-600 rounded mt-2"></div>
          <div className="h-6 w-40 bg-gray-500 rounded mt-1"></div>
        </div>
      ))}
    </div>
  );
}
