import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectMedia } from "@/lib/definitios";
import ImageModal from "./imageModal";

interface ProjectCarouselProps {
  projectMedia: ProjectMedia[];
}

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
    <div className="relative mx-auto w-full sm:my-5">
      <div className="relative flex h-96 items-center justify-center overflow-hidden">
        {projectMedia.map((media, index) => (
          <div
            key={index}
            className="group absolute cursor-pointer transition-transform duration-300"
            style={getImageStyle(index)}
            onClick={() => handleImageClick(index)}
          >
            <div className="relative h-[320px] w-[500px] transform overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-black">
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded bg-black bg-opacity-60 px-3 py-1 text-sm font-semibold text-white">
                {media.tag || "Sin etiqueta"}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 z-10 mx-5 flex p-1 -translate-y-1/2 transform items-center justify-center rounded-full bg-client-accent hover:bg-client-accentHover font-bold sm:left-3 lg:left-4 transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 text-client-text" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 z-10 mx-5 flex p-1 -translate-y-1/2 transform items-center justify-center rounded-full bg-client-accent hover:bg-client-accentHover font-bold  sm:right-3 lg:right-4 transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 text-client-text" />
      </button>

      <div className="flex justify-center space-x-2">
        {getVisibleDots().map((index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 w-2 rounded-full transition-transform duration-300 hover:bg-client-accentHover ${
              currentImage === index
                ? "scale-125 bg-client-accentDark"
                : "scale-100 bg-client-accentLight opacity-75"
            }`}
          />
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
