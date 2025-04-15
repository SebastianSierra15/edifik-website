"use client";

import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardActionsProps {
  id: number;
  name: string;
  urlEdit: string;
  onDelete: (id: number, name: string) => void;
}

export default function ProjectCardActions({
  id,
  name,
  urlEdit,
  onDelete,
}: ProjectCardActionsProps) {
  const router = useRouter();

  return (
    <div className="absolute right-2 top-2 z-10 flex space-x-1">
      <button
        title="Editar"
        onClick={(e) => {
          e.preventDefault();
          router.push(urlEdit);
        }}
        className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
      >
        <Edit className="h-4 w-4" />
      </button>

      <button
        title="Eliminar"
        onClick={(e) => {
          e.preventDefault();
          onDelete(id, name);
        }}
        className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
