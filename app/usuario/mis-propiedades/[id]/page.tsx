"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/src/hooks/auth";
import { PropertyView } from "@/src/components/user";

export default function ViewPropertyPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const params = useParams();

  if (isLoading || !isAuthenticated) return null;

  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  if (!projectId) return null;

  return <PropertyView projectId={Number(projectId)} />;
}
