import ProjectCardSkeleton from "./projectCardSkeleton";

export default function ProjectSkeletonList() {
  return (
    <div className="px-12 pt-10 grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <div className="w-full max-w-xs">
            <ProjectCardSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}
