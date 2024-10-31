import { PropertyMedia } from "@/lib/definitios";

type PropertyGalleryProps = {
  images: PropertyMedia[];
};

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {images.map((media) => (
        <div key={media.id} className="w-full h-64 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${media.url})` }} />
      ))}
    </div>
  );
}
