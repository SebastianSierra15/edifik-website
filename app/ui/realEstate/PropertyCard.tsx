import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { ProjectMedia } from "@/lib/definitios";

interface PropertyCardProps {
  id: number;
  images: ProjectMedia[];
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  url: string;
}

export default function PropertyCard({
  id,
  images,
  price,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  url,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  console.log(id, area, bedrooms, bathrooms, parkingSpots);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isHovered, images]);

  return (
    <Link href={`/${url}/${id}`} target="_blank" rel="noopener noreferrer">
      <div
        className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg bg-client-primary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        <div className="relative flex h-full flex-col rounded-lg bg-client-primaryDark">
          {images.length > 0 ? (
            <div className="relative w-full h-full overflow-hidden flex-shrink-0">
              {images.map((img, index) => (
                <Image
                  key={index + img.projectId}
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
          ) : (
            <div className="flex items-center justify-center h-full text-white bg-gray-700">
              Sin imagen
            </div>
          )}

          {price && (
            <div className="absolute left-2 top-2 z-10 rounded-full bg-black bg-opacity-75 px-2 py-1 text-sm text-white">
              ${price.toLocaleString()}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-gray-800 to-transparent px-2 pb-2 pt-16">
            <div className="flex items-center text-xs text-gray-300 divide-x divide-gray-600">
              {typeof area === "number" && area > 0 && (
                <p className="pr-2">{area}m²</p>
              )}
              {typeof bedrooms === "number" && bedrooms > 0 && (
                <p className="pl-2 pr-2">{bedrooms} Hab.</p>
              )}
              {typeof bathrooms === "number" && bathrooms > 0 && (
                <p className="pl-2 pr-2">{bathrooms} Baños.</p>
              )}
              {typeof parkingSpots === "number" && parkingSpots > 0 && (
                <p className="pl-2">{parkingSpots} Parq.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
