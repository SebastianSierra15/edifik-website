import { useState } from "react";
import { ProjectMedia, ImageType, CommonArea } from "@/lib/definitios";
import ImageModal from "../project/imageModal";

interface ProjectMediaGalleryProps {
  images: ProjectMedia[];
  imageTypes: ImageType[];
  commonAreas: CommonArea[];
}

export default function ProjectMediaGallery({
  images,
  imageTypes,
  commonAreas,
}: ProjectMediaGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (clickedImage: ProjectMedia) => {
    const realIndex = images.findIndex((img) => img.url === clickedImage.url);
    if (realIndex !== -1) {
      setSelectedIndex(realIndex);
      setIsModalOpen(true);
    }
  };

  const imagesByType = imageTypes.map((type) => ({
    typeName: type.name,
    images: images.filter((img) => img.imageType === type.id),
  }));

  const imagesByCommonArea = commonAreas.map((area) => ({
    areaName: area.name,
    images: images.filter((img) => img.commonArea === area.id),
  }));

  return (
    <div className="space-y-6">
      {imagesByType.map(({ typeName, images }) => (
        <ImageSection
          key={typeName}
          category={typeName}
          images={images}
          onImageClick={handleImageClick}
        />
      ))}

      <h2 className="text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight mt-6">
        Imágenes de Áreas Comunes
      </h2>

      {imagesByCommonArea.map(({ areaName, images }) => (
        <ImageSection
          key={areaName}
          category={areaName}
          images={images}
          onImageClick={handleImageClick}
        />
      ))}

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={images}
        initialIndex={selectedIndex}
      />
    </div>
  );
}

const ImageSection = ({
  category,
  images,
  onImageClick,
}: {
  category: string;
  images: ProjectMedia[];
  onImageClick: (image: ProjectMedia) => void;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-premium-textPrimary dark:text-premium-textPrimary">
      {category}
    </h3>
    {images.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex flex-col bg-premium-backgroundLight dark:bg-premium-backgroundDark rounded-lg shadow-md overflow-hidden"
          >
            <div
              onClick={() => onImageClick(image)}
              className="relative cursor-pointer"
            >
              <div
                className="relative h-48 w-full rounded-t-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${encodeURI(image.url)})` }}
              >
                {image.tag && (
                  <p className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2 text-center text-xs text-white">
                    {image.tag}
                  </p>
                )}
              </div>

              {image.tag && (
                <p className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2 text-center text-xs text-white">
                  {image.tag}
                </p>
              )}
            </div>

            {image.description && (
              <div className="py-2 px-4">
                <label className="text-md font-semibold text-premium-textPrimary dark:text-premium-textSecondary">
                  Descripción
                </label>
                <p className="text-sm text-premium-textPrimary dark:text-premium-textSecondary">
                  {image.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-premium-textSecondary dark:text-premium-textSecondary">
        No hay imágenes disponibles.
      </p>
    )}
  </div>
);
