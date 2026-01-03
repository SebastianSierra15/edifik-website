"use client";

import { useSession } from "next-auth/react";
import { ProjectForm } from "@/src/components/admin";

export default function CreatePropertyPage() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar propiedades"
    ) || false;

  return (
    <ProjectForm
      isEdit={false}
      isProperty={true}
      hasPermission={hasPermission}
    />
  );
}
