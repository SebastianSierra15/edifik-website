"use client";

import { useState, useEffect } from "react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update `currentIndex` when `initialIndex` changes or the modal is reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  // Lock body scroll when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + media.length) % media.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="relative max-w-full w-full md:w-[80%] lg:w-[70%] aspect-video p-4 flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center text-black text-2xl hover:bg-yellow-600"
          aria-label="Close Modal"
        >
          <AiOutlineClose size={20} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-lg overflow-hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src={media[currentIndex]?.url}
              alt={`Project Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Tag */}
        {media[currentIndex]?.tag && (
          <div className="absolute top-8 left-8 bg-black bg-opacity-70 text-white text-lg px-3 py-1 rounded">
            {media[currentIndex].tag}
          </div>
        )}

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-lg px-3 py-1 rounded">
          {currentIndex + 1}/{media.length}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            disabled={media.length === 1}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-black ${
              media.length === 1
                ? "bg-gray-400"
                : "bg-yellow-500 hover:bg-yellow-600"
            } translate-x-4`}
            aria-label="Previous Image in Modal"
          >
            &#10094;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            disabled={media.length === 1}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-black ${
              media.length === 1
                ? "bg-gray-400"
                : "bg-yellow-500 hover:bg-yellow-600"
            } -translate-x-4`}
            aria-label="Next Image in Modal"
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
}
