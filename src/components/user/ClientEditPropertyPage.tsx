import { PropertyForm } from "./createEditProperties/PropertyForm";

interface ClientEditPropertyPageProps {
  projectId: string;
  hasPermission: boolean;
}

export function ClientEditPropertyPage({
  projectId,
  hasPermission,
}: ClientEditPropertyPageProps) {
  const decodedProjectId = projectId ? decodeURIComponent(projectId) : "";

  if (!decodedProjectId || !hasPermission) return null;

  return (
    <PropertyForm
      isEdit={true}
      projectId={Number(decodedProjectId)}
      hasPermission={hasPermission}
    />
  );
}
