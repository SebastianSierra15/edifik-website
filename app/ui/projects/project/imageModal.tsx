"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProjectMedia } from "@/lib/definitios";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: ProjectMedia[];
  initialIndex: number;
}

export default function ImageModal({
  isOpen,
  onClose,
  media,
  initialIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

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
        className="relative flex aspect-video w-full max-w-full items-center justify-center p-4 md:w-[80%] lg:w-[70%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-2xl text-black hover:bg-yellow-600"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-black bg-opacity-50">
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
          <div className="absolute left-8 top-8 rounded bg-black bg-opacity-70 px-3 py-1 text-lg text-white">
            {media[currentIndex].tag}
          </div>
        )}

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform rounded bg-black bg-opacity-70 px-3 py-1 text-lg text-white">
          {currentIndex + 1}/{media.length}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            disabled={media.length === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-black ${
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
            className={`flex h-10 w-10 items-center justify-center rounded-full text-black ${
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
