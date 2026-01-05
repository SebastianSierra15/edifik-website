import { PropertyForm } from "./createEditProperties/PropertyForm";

interface ClientUploadPropertyPageProps {
  hasPermission: boolean;
}

export function ClientUploadPropertyPage({
  hasPermission,
}: ClientUploadPropertyPageProps) {
  if (!hasPermission) return null;

  return <PropertyForm isEdit={false} hasPermission={hasPermission} />;
}
