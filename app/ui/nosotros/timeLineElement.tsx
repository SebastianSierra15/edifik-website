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
    <div className="timeline-element relative flex flex-col flex-none w-64 py-4">
      <div className="relative mx-auto mb-4 group image-container">
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
          className="image object-cover hidden"
          priority
        />
        <Image
          src={ImageSrc3}
          alt={`Imagen del proyecto ${ImageTitle} - 3`}
          width={208}
          height={128}
          className="image object-cover hidden"
          priority
        />
      </div>

      <div className="flex items-center">
        <span
          className={`circle w-5 h-5 rounded-full border-2 ${
            isActive ? "bg-blue-500" : "bg-transparent"
          } border-blue-500`}
          aria-label={`Paso del timeline: ${year}`}
        ></span>
        <div className="w-full h-0.5 bg-blue-500"></div>
      </div>

      <h3 className="mx-5 mt-5 mb-10 text-left text-xl font-bold lg:text-3xl">
        {year}
      </h3>

      <h4 className="mx-5 pr-4 mb-4 text-left text-lg font-semibold text-blue-500 lg:text-2xl">
        {title}
      </h4>

      <p className="mx-5 w-full pr-4 text-left text-sm text-black lg:text-base text-ellipsis overflow-hidden whitespace-normal">
        {description}
      </p>
    </div>
  );
}
