"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ProjectForm from "@/app/ui/admin/projects/createEditProject/projectForm";

export default function EditPropertyPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar propiedades"
    ) || false;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return (
    <ProjectForm
      isEdit={true}
      isProperty={true}
      projectId={Number(projectId)}
      hasPermission={hasPermission}
    />
  );
}
