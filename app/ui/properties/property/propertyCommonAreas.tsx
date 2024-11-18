import React, { useState } from "react";
import Image from "next/image";
import { CommonArea, PropertyMedia } from "@/lib/definitios";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";

type PropertyCommonAreasProps = {
  areas: CommonArea[];
  propertyMedia: PropertyMedia[];
};

export default function PropertyCommonAreas({
  areas,
  propertyMedia,
}: PropertyCommonAreasProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
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

  return (
    <div className="my-8 w-2/3">
      <h2 style={{ color: "#8B4513" }} className="text-2xl font-semibold mb-4">
        Áreas Comunes
      </h2>
      {areas.map((area, index) => {
        const areaImages = propertyMedia.filter(
          (media) => media.commonArea === area.id
        );

        return (
          <div
            key={area.id}
            className="mb-4 p-4 rounded-lg shadow"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center font-semibold text-lg"
              style={{ color: "#5D4037" }}
            >
              <span>{area.name}</span>
              <AiOutlineDown
                className={`transition-transform ${
                  openAccordion === index ? "rotate-180" : "rotate-0"
                }`}
                style={{ color: "#DAA520" }}
              />
            </button>
            {openAccordion === index && areaImages.length > 0 && (
              <div className="mt-2">
                <div className="flex overflow-x-auto space-x-2">
                  {areaImages.map((media, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => handleImageClick(imgIndex)}
                    >
                      <Image
                        src={media.url}
                        alt={`Imagen de ${area.name}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover"
                        style={{
                          border: "2px solid #EDEDED",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

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
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-black text-xl font-bold hover:bg-opacity-100 m-2"
              style={{ color: "#8B4513", backgroundColor: "#DAA520" }}
              aria-label="Close Modal"
            >
              <AiOutlineClose size={16} />
            </button>

            <Image
              src={propertyMedia[modalImageIndex]?.url}
              alt={`Imagen ${modalImageIndex + 1}`}
              width={1200}
              height={700}
              className="w-full h-auto rounded-lg object-cover"
            />

            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm py-1 px-4 rounded"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              {modalImageIndex + 1}/{propertyMedia.length}
            </div>

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
