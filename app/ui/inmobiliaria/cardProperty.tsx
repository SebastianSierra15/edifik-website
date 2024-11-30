import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
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
        className={`relative shadow-slate-400 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 z-50 bg-white dark:bg-secondary dark:shadow-black cursor-pointer p-1 bg-gradient-to-r from-primaryLight to-primaryDark hover:from-primaryLight hover:to-primary duration-300 animate-borderFlow border-transparent bg-clip-border ${
          isFromMap ? "max-w-xs" : "max-w-sm min-h-52"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        <div className="relative bg-background dark:bg-secondary rounded-lg">
          {/* Botón de cierre solo si onClose no es null */}
          {onClose && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="absolute top-2 right-2 z-50 bg-black dark:bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 dark:hover:bg-opacity-75 transition-all"
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
                className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Degradado en la parte inferior de la imagen solo si isFromMap es false */}
            {!isFromMap && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 dark:from-darkBackground via-gray-800 dark:via-darkBackgroundLight to-transparent"></div>
            )}
          </div>

          {/* Espacio adicional debajo de la imagen solo si isFromMap es false */}
          {!isFromMap && (
            <div className="p-4 bg-background dark:bg-secondary">
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
