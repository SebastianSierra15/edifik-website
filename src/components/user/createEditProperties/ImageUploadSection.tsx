import { useMemo, useCallback } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { ImageType } from "@/src/interfaces";
import { ImageWithTag } from "@/src/components/admin/projects/createEditProject/ImageWithTag";
import { ClientFormErrorMessage } from "@/src/components/shared";

interface ImageUploadSectionProps {
  imageType: ImageType;
  category: string;
  expanded: boolean;
  images: (File | string)[];
  descriptions: string[];
  error: string | null;
  errors: Record<string, string>;
  onToggleExpand: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onDescriptionChange: (index: number, description: string) => void;
}

export function ImageUploadSection({
  imageType,
  category,
  expanded,
  images,
  descriptions,
  error,
  errors,
  onToggleExpand,
  onImageChange,
  onRemoveImage,
  onDescriptionChange,
}: ImageUploadSectionProps) {
  const handleRemoveImage = useCallback(
    (index: number) => onRemoveImage(index),
    [onRemoveImage]
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
        file={file}
        description={descriptions[index] || ""}
        imageTypeId={imageType.id}
        category={category}
        onRemove={() => handleRemoveImage(index)}
        onDescriptionChange={(newDescription) =>
          handleDescriptionChange(index, newDescription)
        }
        descriptionError={errors[`${imageType.name}-description-${index}`]}
        showDescription={false}
        className="bg-client-backgroundLight"
      />
    ));
  }, [
    images,
    descriptions,
    errors,
    handleRemoveImage,
    handleDescriptionChange,
    imageType.id,
    imageType.name,
    category,
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

      if (imageType.id === 1006 && totalImages < 3) {
        alert(`Debes subir al menos 3 imǭgenes para ${imageType.name}`);
        return;
      }

      onImageChange(event);
    },
    [
      images.length,
      imageType.maxImagesAllowed,
      imageType.name,
      imageType.id,
      onImageChange,
    ]
  );

  return (
    <div
      className={clsx(
        "rounded-md pb-1 transition bg-client-backgroundLight hover:bg-client-backgroundAlt",
        error ? "border border-red-500" : "border-none"
      )}
    >
      <div
        className="flex flex-col cursor-pointer p-4 space-y-3"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-client-text">
            {imageType.name}
          </h4>

          <ChevronDown
            className={clsx(
              "transition-transform duration-300 text-client-textSecondary",
              expanded && "rotate-180"
            )}
          />
        </div>

        {imageType.description && (
          <p className="text-sm text-gray-400">{imageType.description}</p>
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
              "mt-2 w-full rounded-lg px-3 py-2 text-client-text",
              error ? "border-red-500" : "border-none"
            )}
          />
          <p className="ml-2 mt-1 text-sm text-gray-400">
            {images.length} archivo(s) subido(s)
          </p>

          {error && <ClientFormErrorMessage error={error} />}

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {imageList}
          </div>
        </div>
      )}
    </div>
  );
}
