"use client";

import { useEffect } from "react";
import { useProjectById } from "@/src/hooks/projects";
import { useLoading } from "@/src/providers";
import { ProjectView } from "@/src/components/realEstate";

interface ClientPropertyProps {
  id: string;
}

export function ClientProperty({ id }: ClientPropertyProps) {
  const projectId = decodeURIComponent(id);
  const { project, loading } = useProjectById(Number(projectId), false);
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
