"use client";

import { useProjectById } from "@/src/hooks/projects";
import { ProjectView } from "@/src/components/realEstate/project";

export default function ClientProperty({ id }: { id: string }) {
  const projectId = decodeURIComponent(id);
  const { project } = useProjectById(Number(projectId), false);

  return <>{project && <ProjectView project={project} />}</>;
}
