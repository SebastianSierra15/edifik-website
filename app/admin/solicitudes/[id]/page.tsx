"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProjectView } from "@/src/components/admin";

export default function ViewPropertyPage() {
  const { status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return <ProjectView projectId={Number(projectId)} isProperty={true} />;
}
