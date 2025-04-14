"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ProjectMedia } from "@/lib/definitios";

interface ImageCarouselProps {
  id: number;
  images: ProjectMedia[];
  url: string;
  name?: string;
  showName?: boolean;
}

export default function ImageCarousel({
  id,
  images,
  url,
  name,
  showName = false,
}: ImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  return (
    <Link href={`/${url}/${id}`} target="_blank" rel="noopener noreferrer">
      <div
        className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        {images.map((img, index) => (
          <Image
            key={index + img.projectId}
            src={img.url}
            alt={img.tag}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className={clsx(
              "absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
              index === currentImage ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {showName && name && (
          <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-md max-w-[80%]">
            <p className="text-white text-sm font-semibold truncate">{name}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
