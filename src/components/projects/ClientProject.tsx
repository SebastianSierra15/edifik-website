"use client";

import { useEffect } from "react";
import { useProjectById } from "@/src/hooks/projects";
import { useLoading } from "@/src/providers";
import { ProjectView } from "@/src/components/realEstate/project";
import type { ProjectDetails } from "@/src/interfaces";

interface ClientProjectProps {
  id: string;
  initialProject?: ProjectDetails;
}

export function ClientProject({ id, initialProject }: ClientProjectProps) {
  const projectId = decodeURIComponent(id);
  const { project, loading } = useProjectById(
    Number(projectId),
    true,
    false,
    initialProject
  );
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    if (!loading) return;
    showLoader();
    return () => hideLoader();
  }, [hideLoader, loading, showLoader]);

  if (loading || !project) {
    return <div className="min-h-screen" />;
  }

  return <ProjectView project={project} />;
}
