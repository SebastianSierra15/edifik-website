import { ProjectsShowcaseSkeleton } from "@/src/components/projects/ProjectsShowcaseSkeleton";

interface ProjectsSkeletonListProps {
  groups?: number;
}

export function ProjectsSkeletonList({
  groups = 2,
}: ProjectsSkeletonListProps) {
  return (
    <div className="px-6 py-10 mt-6">
      {Array.from({ length: groups }).map((_, index) => (
        <div key={index}>
          <ProjectsShowcaseSkeleton reverse={index % 2 === 1} />
          {index < groups - 1 && (
            <hr className="mx-auto my-6 w-5/6 border-t border-white bg-transparent" />
          )}
        </div>
      ))}
    </div>
  );
}
