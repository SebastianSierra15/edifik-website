"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PropertieView from "@/app/ui/user/propertieView/propertieView";

export default function ViewPropertyPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  if (status !== "authenticated") return null;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return <PropertieView projectId={Number(projectId)} />;
}
