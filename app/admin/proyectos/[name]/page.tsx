"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/app/ui/projects/createEditProject/projectForm";

export default function EditProjectPage() {
  const params = useParams();
  const projectName = params?.name
    ? decodeURIComponent(params.name as string)
    : "";

  if (!projectName) return null;

  return (
    <ProjectForm isEdit={true} isProperty={false} projectName={projectName} />
  );
}
