"use client";

import { useProjectById } from "@/src/hooks/projects";
import { ProjectView } from "@/src/components/realEstate/project";
import type { ProjectDetails } from "@/src/interfaces";

interface ClientProjectProps {
  id: string;
  initialProject?: ProjectDetails;
}

export function ClientProject({ id, initialProject }: ClientProjectProps) {
  const projectId = decodeURIComponent(id);
  const { project } = useProjectById(
    Number(projectId),
    true,
    false,
    initialProject
  );

  return <>{project && <ProjectView project={project} />}</>;
}
