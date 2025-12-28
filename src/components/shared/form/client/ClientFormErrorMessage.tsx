import { CircleAlert } from "lucide-react";

interface ClientFormErrorMessageProps {
  error?: string;
}

export function ClientFormErrorMessage({
  error,
}: ClientFormErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
      <CircleAlert className="h-4 w-4" />
      {error}
    </div>
  );
}
