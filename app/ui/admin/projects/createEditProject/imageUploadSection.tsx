import { useMemo, useCallback } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { ImageType } from "@/lib/definitios";
import ImageWithTag from "./imageWithTag";
import { FormErrorMessage } from "@/src/components/shared";

interface ImageUploadSectionProps {
  imageType: ImageType;
  category: string;
  expanded: boolean;
  images: (File | string)[];
  tags: string[];
  descriptions: string[];
  error: string | null;
  errors: Record<string, string>;
  onToggleExpand: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onTagChange: (index: number, tag: string) => void;
  onDescriptionChange: (index: number, description: string) => void;
}

export default function ImageUploadSection({
  imageType,
  category,
  expanded,
  images,
  tags,
  descriptions,
  error,
  errors,
  onToggleExpand,
  onImageChange,
  onRemoveImage,
  onTagChange,
  onDescriptionChange,
}: ImageUploadSectionProps) {
  const handleRemoveImage = useCallback(
    (index: number) => onRemoveImage(index),
    [onRemoveImage]
  );

  const handleTagChange = useCallback(
    (index: number, newTag: string) => {
      onTagChange(index, newTag);
    },
    [onTagChange]
  );

  const handleDescriptionChange = useCallback(
    (index: number, newDescription: string) => {
      onDescriptionChange(index, newDescription);
    },
    [onDescriptionChange]
  );

  const imageList = useMemo(() => {
    return images.map((file, index) => (
      <ImageWithTag
        key={`${imageType.name}-${index}`}
        id={`${imageType.name}-${index}`}
        file={typeof file === "string" ? file : URL.createObjectURL(file)}
        tag={tags[index] || ""}
        description={descriptions[index] || ""}
        imageTypeId={imageType.id}
        category={category}
        onRemove={() => handleRemoveImage(index)}
        onTagChange={(newTag) => handleTagChange(index, newTag)}
        onDescriptionChange={(newDescription) =>
          handleDescriptionChange(index, newDescription)
        }
        error={errors[`${imageType.name}-tag-${index}`]}
        descriptionError={errors[`${imageType.name}-description-${index}`]}
      />
    ));
  }, [
    images,
    tags,
    descriptions,
    errors,
    handleRemoveImage,
    handleTagChange,
    handleDescriptionChange,
  ]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const selectedFiles = Array.from(event.target.files);
      const totalImages = images.length + selectedFiles.length;

      if (
        imageType.maxImagesAllowed &&
        totalImages > imageType.maxImagesAllowed
      ) {
        alert(
          `Solo puedes subir hasta ${imageType.maxImagesAllowed} imagen${
            imageType.maxImagesAllowed > 1 ? "es" : ""
          } para ${imageType.name}`
        );
        return;
      }

      onImageChange(event);
    },
    [images.length, imageType.maxImagesAllowed, imageType.name, onImageChange]
  );

  return (
    <div
      className={clsx(
        "rounded-md pb-1 transition bg-premium-backgroundDark hover:bg-premium-background dark:bg-premium-background dark:hover:bg-premium-backgroundLight",
        error ? "border border-red-500" : "border-none"
      )}
    >
      <div
        className="flex flex-col cursor-pointer p-4 space-y-3"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-premium-textPrimary">
            {imageType.name}
          </h4>
          <ChevronDown
            className={clsx(
              "transition-transform duration-300 text-premium-textPrimary dark:text-premium-textSecondary",
              expanded && "rotate-180"
            )}
          />
        </div>

        {imageType.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {imageType.description}
          </p>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className={clsx(
              "mt-2 w-full rounded-lg px-3 py-2 text-premium-textPrimary",
              error ? "border-red-500" : "border-none"
            )}
          />
          <p className="ml-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
            {images.length} archivo(s) subido(s)
          </p>

          {error && <FormErrorMessage error={error} />}

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {imageList}
          </div>
        </div>
      )}
    </div>
  );
}
