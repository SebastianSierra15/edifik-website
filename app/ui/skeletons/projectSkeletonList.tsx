import clsx from "clsx";
import { useMemo } from "react";
import ProjectCardSkeleton from "./projectCardSkeleton";

interface ProjectSkeletonListProps {
  count: number;
}

const ProjectSkeletonList = ({ count }: ProjectSkeletonListProps) => {
  const skeletons = useMemo(
    () =>
      Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="w-full">
          <ProjectCardSkeleton />
        </div>
      )),
    [count]
  );

  return (
    <div className="-mt-10 w-full flex justify-center">
      <div
        className={clsx(
          "grid gap-x-4 gap-y-6 py-4 mx-auto max-w-screen-xl",
          "grid-cols-[repeat(auto-fit,minmax(270px,1fr))]"
        )}
      >
        {skeletons}
      </div>
    </div>
  );
};

export default ProjectSkeletonList;
