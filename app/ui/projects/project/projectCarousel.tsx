import { useState, useMemo } from "react";
import Image from "next/image";
import ImageModal from "./imageModal";
import { ProjectMedia } from "@/lib/definitios";

type ProjectCarouselProps = {
  projectMedia: ProjectMedia[];
};

export default function ProjectCarousel({
  projectMedia,
}: ProjectCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % projectMedia.length);
  };

  const prevSlide = () => {
    setCurrentImage(
      (prev) => (prev - 1 + projectMedia.length) % projectMedia.length
    );
  };

  const handleImageClick = (index: number) => {
    setCurrentImage(index);
    setIsModalOpen(true);
  };

  const getImageStyle = useMemo(
    () => (index: number) => {
      const position =
        (index - currentImage + projectMedia.length) % projectMedia.length;

      let transform = "";
      let zIndex = 0;

      switch (position) {
        case 0:
          transform = "translateX(0) scale(1)";
          zIndex = 3;
          break;
        case 1:
        case projectMedia.length - 1:
          transform = `translateX(${
            position === 1 ? "50%" : "-50%"
          }) scale(0.75)`;
          zIndex = 2;
          break;
        case 2:
        case projectMedia.length - 2:
          transform = `translateX(${
            position === 2 ? "90%" : "-90%"
          }) scale(0.55)`;
          zIndex = 1;
          break;
        default:
          transform = "scale(0.6)";
          zIndex = 0;
      }

      return {
        transform,
        zIndex,
        transition: "transform 0.5s ease",
      };
    },
    [currentImage, projectMedia.length]
  );

  const getVisibleDots = () => {
    const maxDots = 5;
    const half = Math.floor(maxDots / 2);

    if (projectMedia.length <= maxDots) {
      return projectMedia.map((_, index) => index);
    }

    let start = currentImage - half;
    let end = currentImage + half + 1;

    if (start < 0) {
      start = 0;
      end = maxDots;
    } else if (end > projectMedia.length) {
      start = projectMedia.length - maxDots;
      end = projectMedia.length;
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <div className="relative w-full mx-auto sm:my-5">
      <div className="relative flex justify-center items-center overflow-hidden h-96">
        {projectMedia.map((media, index) => (
          <div
            key={index}
            className="absolute cursor-pointer group transition-transform duration-300"
            style={getImageStyle(index)}
            onClick={() => handleImageClick(index)}
          >
            <div className="relative w-[500px] h-[320px] overflow-hidden group-hover:scale-105 transform transition-transform duration-300">
              <Image
                src={media.url}
                alt={`Project Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="rounded-lg object-cover"
                priority={index === currentImage}
              />
            </div>

            {index === currentImage && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm font-semibold py-1 px-3 rounded">
                {media.tag || "Sin etiqueta"}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-3 lg:left-4 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 z-10 mx-5"
        style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-3 lg:right-4 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 z-10 mx-5"
        style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      <div className="flex justify-center space-x-2">
        {getVisibleDots().map((index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-transform duration-300 ${
              currentImage === index
                ? "bg-[#8B4513] scale-125"
                : "bg-[#DAA520] scale-100 opacity-75"
            }`}
          ></button>
        ))}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={projectMedia}
        initialIndex={currentImage}
      />
    </div>
  );
}
