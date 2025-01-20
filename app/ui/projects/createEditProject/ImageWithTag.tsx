import { ChangeEvent, useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ImageWithTagProps = {
  file: File;
  tag: string;
  description: string;
  imageTypeId: number;
  onRemove: () => void;
  onTagChange: (newTag: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  error?: string;
  descriptionError?: string;
};

export default function ImageWithTag({
  file,
  tag,
  description,
  imageTypeId,
  onRemove,
  onTagChange,
  onDescriptionChange,
  error,
  descriptionError,
}: ImageWithTagProps) {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTagChange(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onDescriptionChange(e.target.value);
  };

  return (
    <div className="relative w-48 rounded-md border border-gray-300 bg-premium-backgroundLight p-3 dark:border-gray-700 dark:bg-premium-backgroundDark">
      <div
        className="relative mb-4 h-32 w-full rounded-md bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-gray-400 p-1 text-white transition hover:bg-gray-600"
          onClick={onRemove}
          aria-label="Eliminar imagen"
        >
          <AiOutlineClose className="h-4 w-4" />
        </button>
      </div>

      <label className="mb-2 block text-sm font-medium text-premium-textPrimary dark:text-premium-textSecondary">
        Nombre de imagen
      </label>
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Nombre"
        maxLength={50}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-premium-textPrimary focus:outline-none focus:ring-2 focus:ring-premium-primary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="mt-2 text-xs text-red-500">Etiqueta obligatoria.</p>
      )}

      {imageTypeId === 1005 && (
        <>
          <label className="mb-2 mt-4 block text-sm font-medium text-premium-textPrimary dark:text-premium-textSecondary">
            Descripción corta
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Descripción"
            maxLength={100}
            className={`h-20 w-full rounded-md border bg-white px-3 py-2 text-sm text-premium-textPrimary focus:outline-none focus:ring-2 dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
              descriptionError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {descriptionError && (
            <p className="mt-1 text-xs text-red-500">{descriptionError}</p>
          )}
        </>
      )}
    </div>
  );
}
