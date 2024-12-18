import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { ProjectMedia } from "@/lib/definitios";
import Link from "next/link";
import Image from "next/image";

type ProjectCardProps = {
  images: ProjectMedia[];
  name: string;
  location: string;
  price: number;
  area: number;
  isFromMap: boolean;
  showActions: boolean;
  onClose?: (() => void) | null;
  url: string;
  urlEdit: string;
};

export default function ProjectCard({
  images,
  name,
  location,
  price,
  area,
  isFromMap,
  showActions,
  onClose,
  url,
  urlEdit,
}: ProjectCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div className="bg-transparent dark:bg-transparent rounded-lg transform transition-transform hover:scale-105 duration-300">
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <div
          className={`relative max-w-xs shadow-premium-secondary dark:shadow-white rounded-lg overflow-hidden bg-premium-secondary dark:bg-premium-secondaryDark cursor-pointer shadow-md dark:shadow-md ${
            isFromMap
              ? "z-50 hover:scale-105 transition-transform duration-300"
              : "h-[370px] z-0"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImage(0);
          }}
        >
          {showActions && (
            <div className="absolute top-2 right-2 flex space-x-2 z-50">
              <Link
                href={urlEdit}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <FaEdit />
              </Link>
              <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                <FaTrash />
              </button>
            </div>
          )}

          <div className="bg-premium-background dark:bg-premium-secondaryDark rounded-lg h-full flex flex-col relative">
            {onClose && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                className="absolute top-2 right-2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <FaTimes />
              </button>
            )}

            <div
              className={`relative w-full z-0 overflow-hidden ${
                !isFromMap ? "flex-shrink-0 h-full" : "h-72"
              }`}
            >
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={img.url}
                  alt={img.tag}
                  fill
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded-full z-50">
              ${price.toLocaleString()}
            </div>

            <div className="px-2 pt-16 pb-2 z-20 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-premium-secondaryDark dark:from-black via-premium-secondaryDark dark:via-gray-800 to-transparent">
              <h3 className="text-lg font-semibold text-white leading-tight break-words line-clamp-1">
                {name}
              </h3>
              <p className="text-sm text-gray-300">{location}</p>
              {area > 0 && (
                <p className="text-xs text-gray-300">Área: {area} m²</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
