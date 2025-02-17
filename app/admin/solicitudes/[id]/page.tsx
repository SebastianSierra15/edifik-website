"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ProjectView from "@/app/ui/projects/projectView/projectView";

export default function ViewPropertyPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return <ProjectView projectId={Number(projectId)} isProperty={true} />;
}
