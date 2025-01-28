import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { X } from "lucide-react";
import { ProjectMedia } from "@/lib/definitios";
import Link from "next/link";
import Image from "next/image";

const Edit = dynamic(() => import("lucide-react").then((mod) => mod.Edit));
const Trash2 = dynamic(() => import("lucide-react").then((mod) => mod.Trash2));

interface ProjectCardProps {
  id: number;
  images: ProjectMedia[];
  name: string;
  location: string;
  price?: number;
  area: number;
  username?: string;
  isFromMap: boolean;
  showActions: boolean;
  onClose?: (() => void) | null;
  url: string;
  urlEdit: string;
  onDelete: (id: number, name: string) => void;
  permission?: boolean;
}

export default function ProjectCard({
  id,
  images,
  name,
  location,
  price,
  area,
  username,
  isFromMap,
  showActions,
  onClose,
  url,
  urlEdit,
  onDelete,
  permission,
}: ProjectCardProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  return (
    <div className="transform rounded-lg bg-transparent transition-transform duration-300 hover:scale-105 dark:bg-transparent">
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <div
          className={clsx(
            "relative max-w-xs cursor-pointer overflow-hidden rounded-lg bg-premium-secondary shadow-md shadow-premium-secondary dark:bg-premium-secondaryDark dark:shadow-md dark:shadow-white",
            isFromMap ? "z-20" : "z-0 h-[370px]"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImage(0);
          }}
        >
          <div className="relative flex h-full flex-col rounded-lg bg-premium-background dark:bg-premium-secondaryDark">
            {onClose && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                className="absolute right-2 top-2 z-20 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div
              className={clsx(
                "relative z-0 w-full overflow-hidden",
                !isFromMap ? "h-full flex-shrink-0" : "h-72"
              )}
            >
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={img.url}
                  alt={img.tag}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={clsx(
                    "absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                    index === currentImage ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>

            {price && (
              <div className="absolute left-2 top-2 z-50 rounded-full bg-black bg-opacity-75 px-2 py-1 text-sm text-white">
                ${price.toLocaleString()}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-premium-secondaryDark via-premium-secondaryDark to-transparent px-2 pb-2 pt-16 dark:from-black dark:via-gray-800">
              <h3 className="line-clamp-1 break-words text-lg font-semibold leading-tight text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-300">{location}</p>
              {area > 0 && (
                <p className="text-xs text-gray-300">Área: {area} m²</p>
              )}
              {id && permission && (
                <p className="text-xs text-gray-300">id: {id}</p>
              )}
              {username && permission && (
                <p className="text-xs text-gray-300">Usuario: {username}</p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showActions && (
        <div className="absolute right-2 top-2 z-50 flex space-x-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push(urlEdit);
            }}
            className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(id, name);
            }}
            className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
