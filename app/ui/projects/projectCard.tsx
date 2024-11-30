import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";

type ProjectCardProps = {
  images: string[];
  name: string;
  location: string;
  price: number;
  area: number;
  idMembership: number;
  isFromMap: boolean;
  showActions: boolean;
  onClose?: (() => void) | null;
  url: string;
};

export default function ProjectCard({
  images,
  name,
  location,
  price,
  area,
  idMembership,
  isFromMap,
  showActions,
  onClose,
  url,
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
    <div className="bg-background dark:bg-backgroundDark rounded-lg">
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <div
          className={`relative max-w-xs shadow-secondary dark:shadow-white rounded-lg overflow-hidden bg-secondary dark:bg-secondaryDark cursor-pointer shadow-md dark:shadow-md ${
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
            <div className="absolute top-3 right-3 flex space-x-2 z-50">
              <button className="p-2 rounded-full bg-primaryLight text-white hover:bg-primaryDark transition-colors">
                <FaEdit />
              </button>
              <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                <FaTrash />
              </button>
            </div>
          )}

          <div className="bg-background dark:bg-secondaryDark rounded-lg h-full flex flex-col relative">
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
                <img
                  key={index}
                  src={img}
                  alt="Project"
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Precio fijo en la esquina superior izquierda */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded-full z-50">
              ${price.toLocaleString()}
            </div>

            <div className="px-2 pt-16 pb-2 z-20 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondaryDark dark:from-black via-secondaryDark dark:via-gray-800 to-transparent">
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
