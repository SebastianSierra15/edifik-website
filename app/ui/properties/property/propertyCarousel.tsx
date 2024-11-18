import { useState } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { PropertyMedia } from "@/lib/definitios";

type PropertyCarouselProps = {
  propertyMedia: PropertyMedia[];
};

export default function PropertyCarousel({
  propertyMedia,
}: PropertyCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % propertyMedia.length);
  };

  const prevSlide = () => {
    setCurrentImage(
      (prev) => (prev - 1 + propertyMedia.length) % propertyMedia.length
    );
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % propertyMedia.length);
  };

  const prevModalImage = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + propertyMedia.length) % propertyMedia.length
    );
  };

  const getImageStyle = (index: number) => {
    const position =
      (index - currentImage + propertyMedia.length) % propertyMedia.length;

    let transform = "";
    let zIndex = 0;
    let scale = 0.8;

    switch (position) {
      case 0:
        transform = "translateX(0) scale(1)";
        zIndex = 3;
        scale = 1;
        break;
      case 1:
      case propertyMedia.length - 1:
        transform = `translateX(${
          position === 1 ? "50%" : "-50%"
        }) scale(0.75)`;
        zIndex = 2;
        break;
      case 2:
      case propertyMedia.length - 2:
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
  };

  const getVisibleDots = () => {
    const half = Math.floor(5 / 2);
    const totalImages = propertyMedia.length;
    let start = currentImage - half;
    let end = currentImage + half + 1;

    if (start < 0) {
      start = 0;
      end = 5;
    } else if (end > totalImages) {
      start = totalImages - 5;
      end = totalImages;
    }

    return Array.from({ length: 5 }, (_, i) => (start + i) % totalImages);
  };

  return (
    <div className="relative w-full mx-auto sm:my-5">
      {/* Carousel Images */}
      <div className="relative flex justify-center items-center overflow-hidden h-80">
        {propertyMedia.map((media, index) => {
          const isCenter = index === currentImage;

          return (
            <div
              key={index}
              className="absolute cursor-pointer"
              style={getImageStyle(index)}
              onClick={() => handleImageClick(index)}
            >
              <div className="relative">
                <Image
                  src={media.url}
                  alt={`Property Image ${index + 1}`}
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                  priority // Prioritiza la carga de las imágenes
                />
                {!isCenter && (
                  <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 z-10 mx-5"
        style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 z-10 mx-5"
        style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Navigation Dots with Animation */}
      <div className="flex justify-center mt-4 space-x-2">
        {getVisibleDots().map((index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-transform duration-300 ${
              currentImage === index
                ? "bg-[#8B4513] scale-125"
                : "bg-[#DAA520] scale-100 opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              transform: currentImage === index ? "scale(1.2)" : "scale(1)",
            }}
          ></button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 m-2"
              style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
              aria-label="Close Modal"
            >
              <AiOutlineClose size={16} />
            </button>

            {/* Image in Modal */}
            <Image
              src={propertyMedia[modalImageIndex]?.url}
              alt={`Property Image ${modalImageIndex + 1}`}
              width={1200}
              height={700}
              className="w-full h-auto rounded-lg object-cover"
              priority
            />

            {/* Image Counter */}
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm py-1 px-4 rounded"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              {modalImageIndex + 1}/{propertyMedia.length}
            </div>

            {/* Navigation Buttons in Modal */}
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevModalImage();
                }}
                className="rounded-full w-9 h-9 flex items-center justify-center text-black text-2xl font-bold hover:bg-opacity-100 m-1"
                style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
                aria-label="Previous Image in Modal"
              >
                &#10094;
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextModalImage();
                }}
                className="rounded-full w-9 h-9 flex items-center justify-center text-black text-2xl font-bold hover:bg-opacity-100 m-1"
                style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
                aria-label="Next Image in Modal"
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
