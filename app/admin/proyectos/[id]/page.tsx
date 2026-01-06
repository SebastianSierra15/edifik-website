"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProjectForm } from "@/src/components/admin";

export default function EditProjectPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar proyectos"
    ) || false;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return (
    <ProjectForm
      isEdit={true}
      isProperty={false}
      projectId={Number(projectId)}
      hasPermission={hasPermission}
    />
  );
}
