import { AiOutlineDown, AiOutlineExclamationCircle } from "react-icons/ai";
import ImageWithTag from "./ImageWithTag";
import { ImageType } from "@/lib/definitios";

type ImageUploadSectionProps = {
  imageType: ImageType;
  expanded: boolean;
  images: File[];
  tags: string[];
  descriptions: string[];
  error: string | null;
  errors: Record<string, string>;
  onToggleExpand: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onTagChange: (index: number, tag: string) => void;
  onDescriptionChange: (index: number, description: string) => void;
};

export default function ImageUploadSection({
  imageType,
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
  return (
    <div
      className={`dark:bg-premium-backgroundDarkAlt rounded-md bg-premium-backgroundAlt pb-1 hover:bg-premium-backgroundLight hover:dark:bg-premium-backgroundLight ${
        error ? "border border-red-500" : "border-none"
      }`}
    >
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={onToggleExpand}
      >
        <h4 className="text-lg font-semibold text-premium-textPrimary">
          {imageType.name}
        </h4>
        <AiOutlineDown
          className={`${
            expanded ? "rotate-180" : ""
          } text-premium-textPrimary transition-transform duration-300 dark:text-premium-textSecondary`}
        />
      </div>

      {imageType.description && (
        <p className="-mt-3 mb-4 cursor-pointer px-4 text-sm text-gray-600 dark:text-gray-400">
          {imageType.description}
        </p>
      )}

      {expanded && (
        <div className="px-4 pb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImageChange}
            className={`mt-2 w-full rounded-lg bg-premium-backgroundDark px-3 py-2 text-premium-textPrimary dark:bg-premium-background ${
              error ? "border-red-500" : "border-none"
            }`}
          />
          <p className="ml-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
            {images.length} archivo(s) subido(s)
          </p>

          {error && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
              <AiOutlineExclamationCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="mt-2 flex flex-wrap">
            {images.map((file, index) => (
              <ImageWithTag
                key={index}
                file={file}
                tag={tags[index] || ""}
                description={descriptions[index] || ""}
                imageTypeId={imageType.id}
                onRemove={() => onRemoveImage(index)}
                onTagChange={(newTag) => onTagChange(index, newTag)}
                onDescriptionChange={(newDescription) =>
                  onDescriptionChange(index, newDescription)
                }
                error={errors[`${imageType.name}-tag-${index}`]}
                descriptionError={
                  errors[`${imageType.name}-description-${index}`]
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
