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
  onToggleExpand,
  onImageChange,
  onRemoveImage,
  onTagChange,
  onDescriptionChange,
}: ImageUploadSectionProps) {
  return (
    <div
      className={`pb-1 rounded-md bg-backgroundAlt dark:bg-backgroundDarkAlt hover:bg-backgroundLight hover:dark:bg-backgroundLight ${
        error ? "border border-red-500" : "border-none"
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer p-4"
        onClick={onToggleExpand}
      >
        <h4 className="text-lg font-semibold text-textPrimary">
          {imageType.name}
        </h4>
        <AiOutlineDown
          className={`${
            expanded ? "rotate-180" : ""
          } transition-transform duration-300 text-textPrimary dark:text-textSecondary`}
        />
      </div>

      {imageType.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 -mt-3 mb-4 px-4 cursor-pointer">
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
            className={`w-full px-3 py-2 rounded-lg bg-backgroundDark dark:bg-background text-textPrimary mt-2 ${
              error ? "border-red-500" : "border-none"
            }`}
          />
          <p className="mt-1 ml-2 text-sm text-gray-600 dark:text-gray-400">
            {images.length} archivo(s) subido(s)
          </p>

          {error && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex flex-wrap mt-2">
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
