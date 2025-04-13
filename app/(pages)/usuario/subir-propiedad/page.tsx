"use client";

import { useSession } from "next-auth/react";
import PropertieForm from "@/app/ui/user/createEditProperties/propertieForm";

export default function UploadPropertyPage() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar propiedades propias"
    ) || false;

  return <PropertieForm isEdit={false} hasPermission={hasPermission} />;
}
