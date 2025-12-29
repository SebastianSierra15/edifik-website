import clsx from "clsx";

interface ProjectsShowcaseSkeletonProps {
  reverse?: boolean;
}

const gridClasses = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-3 lg:col-span-2 lg:row-start-2",
];

const reverseGridClasses = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-span-2 lg:row-start-2",
  "lg:col-span-2 lg:row-span-2 lg:col-start-3",
];

export function ProjectsShowcaseSkeleton({
  reverse = false,
}: ProjectsShowcaseSkeletonProps) {
  const getLayoutClass = (index: number) =>
    reverse ? reverseGridClasses[index % 4] : gridClasses[index % 4];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:grid-rows-2 auto-rows-fr gap-4 h-[600px] sm:h-[300px]">
      {Array.from({ length: 4 }).map((_, index) => {
        const layoutClass = getLayoutClass(index);
        const hasTwoRows = layoutClass.includes("row-span-2");

        return (
          <div
            key={index}
            className={clsx(
              "relative w-full rounded-lg overflow-hidden bg-gray-500 max-sm:row-span-2",
              layoutClass
            )}
          >
            {hasTwoRows ? (
              <div className="absolute bottom-3 left-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-xl bg-zinc-800 px-4 py-3 shadow-md">
                <div className="h-4 w-2/3 rounded bg-gray-300 animate-pulse" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-300 animate-pulse" />
              </div>
            ) : (
              <div className="absolute bottom-3 left-3 rounded-md bg-zinc-800 px-3 py-2 shadow-md">
                <div className="h-3 w-20 rounded bg-gray-300 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
