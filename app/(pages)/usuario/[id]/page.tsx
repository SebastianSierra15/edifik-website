"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PropertieForm from "@/app/ui/user/createEditProperties/propertieForm";

export default function EditPropertyPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar propiedades propias"
    ) || false;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return (
    <PropertieForm
      isEdit={true}
      projectId={Number(projectId)}
      hasPermission={hasPermission}
    />
  );
}
