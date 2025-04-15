"use client";

import { useProjectById } from "@/app/hooks/projects/useProjectById";
import ProjectView from "@/app/ui/realEstate/project/projectView";

export default function ClientProject({ id }: { id: string }) {
  const projectId = decodeURIComponent(id);
  const { project } = useProjectById(Number(projectId), true);

  return <>{project && <ProjectView project={project} />}</>;
}
