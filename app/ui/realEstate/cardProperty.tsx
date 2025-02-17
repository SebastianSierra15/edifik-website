import { useState, useEffect } from "react";
//import { FaTimes } from "react-icons/fa";
import Link from "next/link";

type ProjectCardProps = {
  images: string[];
  name: string;
  location: string;
  price: number;
  area: number;
  address: string;
  idMembership: number;
  showDetails: boolean;
  isFromMap: boolean;
  onClose?: (() => void) | null;
  url: string;
};

export default function ProjectCard({
  images,
  name,
  location,
  price,
  area,
  address,
  idMembership,
  isFromMap,
  showDetails,
  onClose,
  url,
}: ProjectCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <div
        className={`dark:bg-secondary from-primaryLight to-primaryDark hover:from-primaryLight hover:to-primary animate-borderFlow relative z-50 transform cursor-pointer overflow-hidden rounded-lg border-transparent bg-white bg-gradient-to-r bg-clip-border p-1 shadow-lg shadow-slate-400 transition-transform duration-300 hover:scale-105 dark:shadow-black ${
          isFromMap ? "max-w-xs" : "min-h-52 max-w-sm"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        <div className="bg-background dark:bg-secondary relative rounded-lg">
          {/* Botón de cierre solo si onClose no es null */}
          {onClose && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="absolute right-2 top-2 z-50 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75 dark:bg-black dark:hover:bg-opacity-75"
            >
              <FaTimes />
            </button>
          )}

          {/* Imagen principal con efecto de desvanecido */}
          <div className="relative h-64 w-full overflow-hidden">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Project"
                className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Degradado en la parte inferior de la imagen solo si isFromMap es false */}
            {!isFromMap && (
              <div className="dark:from-darkBackground dark:via-darkBackgroundLight absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent" />
            )}
          </div>

          {/* Espacio adicional debajo de la imagen solo si isFromMap es false */}
          {!isFromMap && (
            <div className="bg-background dark:bg-secondary p-4">
              {/* Información de la propiedad */}
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-base text-gray-300">{location}</p>

              {showDetails && (
                <>
                  <p className="text-sm text-gray-300">{address}</p>
                  <p className="text-sm text-gray-300">Área: {area} m²</p>
                </>
              )}

              <p className="text-lg font-bold text-white">
                ${price.toLocaleString()} COP
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
