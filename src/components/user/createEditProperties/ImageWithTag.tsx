import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const ClientFormInput = dynamic(
  () =>
    import("@/src/components/shared/form/client/ClientFormInput").then(
      (mod) => mod.ClientFormInput
    ),
  { ssr: false }
);
const ClientFormTextArea = dynamic(
  () =>
    import("@/src/components/shared/form/client/ClientFormTextArea").then(
      (mod) => mod.ClientFormTextArea
    ),
  { ssr: false }
);

interface ImageWithTagProps {
  id?: string;
  file: File | string;
  tag: string;
  description: string;
  imageTypeId: number;
  category: string;
  onRemove: () => void;
  onTagChange: (newTag: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  error?: string;
  descriptionError?: string;
}

export function ImageWithTag({
  id,
  file,
  tag,
  description,
  imageTypeId,
  category,
  onRemove,
  onTagChange,
  onDescriptionChange,
  error,
  descriptionError,
}: ImageWithTagProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localTag, setLocalTag] = useState(tag);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    if (!file) {
      console.error("ƒ?O No se recibiÇü archivo en ImageWithTag.");
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
    setLocalTag(tag);
  }, [tag]);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTag(e.target.value);
    onTagChange(e.target.value);
  };

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalDescription(e.target.value);
      onDescriptionChange(e.target.value);
    },
    [onDescriptionChange]
  );

  return (
    <div className="relative w-full rounded-md border border-gray-700 bg-client-background p-3 space-y-4">
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

      <ClientFormInput
        id={id}
        label="Nombre"
        type="text"
        name="tag"
        value={localTag}
        onChange={handleTagChange}
        placeholder="Nombre"
        maxLength={100}
        error={error}
        tooltipText="Ingrese un nombre para la imagen."
        isAccent={true}
      />

      {imageTypeId === 1005 && category === "imageType" && (
        <ClientFormTextArea
          label="DescripciÇün"
          name="description"
          value={localDescription}
          onChange={handleDescriptionChange}
          placeholder="DescripciÇün"
          maxLength={100}
          error={descriptionError}
          tooltipText="Ingrese una breve descripciÇün del plano."
          rows={4}
          isAccent={true}
        />
      )}
    </div>
  );
}
