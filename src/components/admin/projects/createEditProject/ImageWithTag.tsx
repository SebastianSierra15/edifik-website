"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { AdminFormTextArea } from "@/src/components/shared";

interface ImageWithTagProps {
  file: File | string;
  description: string;
  imageTypeId: number;
  category: string;
  onRemove: () => void;
  onDescriptionChange: (newDescription: string) => void;
  descriptionError?: string;
}

export function ImageWithTag({
  file,
  description,
  imageTypeId,
  category,
  onRemove,
  onDescriptionChange,
  descriptionError,
}: ImageWithTagProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    if (!file) {
      console.error("❌ No se recibió archivo en ImageWithTag.");
      return;
    }

    if (typeof file === "string") {
      setImageUrl(encodeURI(file));
    } else {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalDescription(e.target.value);
      onDescriptionChange(e.target.value);
    },
    [onDescriptionChange]
  );

  return (
    <div className="relative w-full rounded-md border border-gray-300 bg-premium-backgroundLight p-3 dark:border-gray-700 dark:bg-premium-backgroundDark space-y-4">
      {imageUrl && (
        <div
          className="relative h-32 w-full rounded-md bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-gray-400 p-1 text-white transition hover:bg-gray-600"
            onClick={onRemove}
            aria-label="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {imageTypeId === 1005 && category === "imageType" && (
        <AdminFormTextArea
          label="Descripción"
          name="description"
          value={localDescription}
          onChange={handleDescriptionChange}
          placeholder="Descripción"
          maxLength={100}
          error={descriptionError}
          tooltipText="Ingrese una breve descripción del plano."
          rows={4}
        />
      )}
    </div>
  );
}
