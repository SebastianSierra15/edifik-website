import { CircleAlert } from "lucide-react";

interface FormErrorMessageProps {
  error?: string;
}

export default function FormErrorMessage({ error }: FormErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
      <CircleAlert className="h-4 w-4" />
      {error}
    </div>
  );
}
