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
    <div className="relative bg-backgroundLight dark:bg-backgroundDark border border-gray-300 dark:border-gray-700 rounded-md p-3 w-48">
      <div
        className="relative w-full h-32 bg-cover bg-center rounded-md mb-4"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <button
          type="button"
          className="absolute top-2 right-2 bg-gray-400 text-white rounded-full p-1 hover:bg-gray-600 transition"
          onClick={onRemove}
          aria-label="Eliminar imagen"
        >
          <AiOutlineClose className="w-4 h-4" />
        </button>
      </div>

      <label className="block text-sm font-medium text-textPrimary dark:text-textSecondary mb-2">
        Nombre de imagen
      </label>
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Nombre"
        maxLength={50}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-backgroundLight text-textPrimary dark:text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-2">Etiqueta obligatoria.</p>
      )}

      {imageTypeId === 1005 && (
        <>
          <label className="block text-sm font-medium text-textPrimary dark:text-textSecondary mt-4 mb-2">
            Descripción corta
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Descripción"
            maxLength={100}
            className={`w-full h-20 px-3 py-2 text-sm border rounded-md bg-white dark:bg-backgroundLight text-textPrimary dark:text-textPrimary focus:outline-none focus:ring-2 ${
              descriptionError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {descriptionError && (
            <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
          )}
        </>
      )}
    </div>
  );
}
