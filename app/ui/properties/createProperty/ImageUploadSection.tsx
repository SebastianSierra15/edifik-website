import React from "react";
import { AiOutlineDown, AiOutlineExclamationCircle } from "react-icons/ai";
import ImageWithTag from "./ImageWithTag";

type ImageUploadSectionProps = {
  name: string;
  description?: string;
  maxImages: number;
  titleSize: string;
  expanded: boolean;
  images: File[];
  tags: string[];
  error: string | null;
  onToggleExpand: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onTagChange: (index: number, tag: string) => void;
};

export default function ImageUploadSection({
  name,
  description,
  titleSize,
  expanded,
  images,
  tags,
  error,
  onToggleExpand,
  onImageChange,
  onRemoveImage,
  onTagChange,
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
        <h4 className={`text-${titleSize} font-semibold text-textPrimary`}>
          {name}
        </h4>
        <AiOutlineDown
          className={`${
            expanded ? "rotate-180" : ""
          } transition-transform duration-300 text-textPrimary dark:text-textSecondary`}
        />
      </div>

      {description && (
        <p
          className="text-sm text-gray-600 dark:text-gray-400 -mt-3 mb-4 px-4 cursor-pointer"
          onClick={onToggleExpand}
        >
          {description}
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
                onRemove={() => onRemoveImage(index)}
                onTagChange={(newTag) => onTagChange(index, newTag)}
                error={tags[index] === ""} // Adds red border if tag is missing
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
