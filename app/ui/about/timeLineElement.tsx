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

export default function TimelineElement({
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
      <div className="image-container group relative mx-auto mb-4 rounded-lg overflow-hidden">
        <Image
          src={ImageSrc1}
          alt={`Imagen del proyecto ${ImageTitle} - 1`}
          width={208}
          height={128}
          className="image object-cover"
          priority
        />

        <Image
          src={ImageSrc2}
          alt={`Imagen del proyecto ${ImageTitle} - 2`}
          width={208}
          height={128}
          className="image hidden object-cover"
          priority
        />

        <Image
          src={ImageSrc3}
          alt={`Imagen del proyecto ${ImageTitle} - 3`}
          width={208}
          height={128}
          className="image hidden object-cover"
          priority
        />
      </div>

      <div className="flex items-center">
        <span
          className={`circle h-5 w-5 rounded-full border-2 ${
            isActive ? "bg-client-accentLight" : "bg-transparent"
          } border-client-accentLight`}
          aria-label={`Paso del timeline: ${year}`}
        />
        <div className="h-0.5 w-full bg-client-accentLight" />
      </div>

      <h3 className="mx-5 mb-10 mt-5 text-left text-xl font-medium text-client-accentDark lg:text-3xl">
        {year}
      </h3>

      <h4 className="mx-5 mb-4 pr-4 text-left text-lg font-semibold text-white lg:text-2xl">
        {title}
      </h4>

      <p className="mx-5 w-full overflow-hidden text-ellipsis whitespace-normal pr-4 text-left text-sm md:text-lg text-client-textPlaceholder">
        {description}
      </p>
    </div>
  );
}
