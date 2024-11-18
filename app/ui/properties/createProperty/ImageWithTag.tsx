import { ChangeEvent } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ImageWithTagProps = {
  file: File;
  tag: string;
  onRemove: () => void;
  onTagChange: (newTag: string) => void;
  error?: boolean;
};

export default function ImageWithTag({
  file,
  tag,
  onRemove,
  onTagChange,
  error,
}: ImageWithTagProps) {
  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTagChange(e.target.value);
  };

  return (
    <div className="m-1">
      <div
        className="relative w-40 h-32 bg-cover bg-center rounded-md"
        style={{
          backgroundImage: `url(${URL.createObjectURL(file)})`,
        }}
      >
        <button
          type="button"
          className="absolute top-0 right-0 bg-textPrimary dark:bg-textSecondary bg-opacity-50 text-white rounded-full p-1"
          onClick={onRemove}
        >
          <AiOutlineClose className="w-3 h-3" />
        </button>
      </div>
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Etiqueta de imagen"
        className={`w-full mt-1 px-2 py-1 text-xs border rounded-md bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
}
