import clsx from "clsx";
import Image from "next/image";

interface TimelineElementProps {
  ImageSrc1: string;
  ImageSrc2: string;
  ImageSrc3: string;
  ImageTitle: string;
  year: string;
  title: string;
  description: string;
  isActive: boolean;
}

export function TimelineElement({
  ImageSrc1,
  ImageSrc2,
  ImageSrc3,
  ImageTitle,
  year,
  title,
  description,
  isActive,
}: TimelineElementProps) {
  return (
    <div className="timeline-element relative flex w-64 flex-none flex-col py-4">
      <div className="image-container group relative mx-auto mb-4 h-32 w-52 rounded-lg overflow-hidden cursor-pointer">
        <Image
          src={ImageSrc1}
          alt={`Imagen del proyecto ${ImageTitle} - 1`}
          fill
          sizes="208px"
          className="image object-cover"
        />

        <Image
          src={ImageSrc2}
          alt={`Imagen del proyecto ${ImageTitle} - 2`}
          fill
          sizes="208px"
          className="image hidden object-cover"
        />

        <Image
          src={ImageSrc3}
          alt={`Imagen del proyecto ${ImageTitle} - 3`}
          fill
          sizes="208px"
          className="image hidden object-cover"
        />
      </div>

      <div className="flex items-center">
        <span
          className={clsx(
            "circle h-5 w-5 rounded-full border-2 border-client-accentLight",
            isActive ? "bg-client-accentLight" : "bg-transparent"
          )}
          aria-label={`Paso del timeline: ${year}`}
        />
        <div className="h-0.5 w-full bg-client-accentLight" />
      </div>

      <h3 className="mx-5 mb-10 mt-5 text-left text-lg font-medium text-client-accentDark lg:text-xl">
        {year}
      </h3>

      <h4 className="mx-5 mb-4 pr-4 text-left font-medium text-white lg:text-2xl line-clamp-2">
        {title}
      </h4>

      <p className="mx-5 w-full overflow-hidden text-ellipsis whitespace-normal pr-4 text-left text-sm md:text-base text-client-textPlaceholder">
        {description}
      </p>
    </div>
  );
}
