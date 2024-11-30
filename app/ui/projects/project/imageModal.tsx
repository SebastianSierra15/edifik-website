import { useState } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { ProjectMedia } from "@/lib/definitios";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  media: ProjectMedia[];
  initialIndex: number;
};

export default function ImageModal({
  isOpen,
  onClose,
  media,
  initialIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 m-2"
          style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
          aria-label="Close Modal"
        >
          <AiOutlineClose size={16} />
        </button>

        {/* Image in Modal */}
        <Image
          src={media[currentIndex]?.url}
          alt={`Project Image ${currentIndex + 1}`}
          width={1200}
          height={700}
          className="w-full h-auto rounded-lg object-cover"
          priority
        />

        {/* Image Counter */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm py-1 px-4 rounded"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          {currentIndex + 1}/{media.length}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="rounded-full w-9 h-9 flex items-center justify-center text-black text-2xl font-bold hover:bg-opacity-100 m-1"
            style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
            aria-label="Previous Image in Modal"
          >
            &#10094;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="rounded-full w-9 h-9 flex items-center justify-center text-black text-2xl font-bold hover:bg-opacity-100 m-1"
            style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
            aria-label="Next Image in Modal"
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
}
