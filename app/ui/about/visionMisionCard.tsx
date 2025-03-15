import Image from "next/image";

interface VisionMisionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  bgColor: string;
}

export default function VisionMisionCard({
  title,
  description,
  imageSrc,
  bgColor,
}: VisionMisionCardProps) {
  return (
    <div className="col-span-3 mx-auto flex w-full overflow-hidden md:col-span-1">
      <div
        className={`flex flex-col justify-stretch rounded-lg border px-6 py-8 text-center shadow ${bgColor} border-white`}
      >
        <h3 className="mb-5 text-2xl font-semibold uppercase tracking-wider text-white">
          {title}
        </h3>

        <p className="mb-10 text-justify font-light text-sm md:text-lg text-client-primaryLight">
          {description}
        </p>

        <div className="mt-auto flex justify-center">
          <Image
            className="self-end h-full object-cover object-bottom"
            src={imageSrc}
            alt={`Imagen representativa de ${title}`}
            width={500}
            height={300}
            priority
          />
        </div>
      </div>
    </div>
  );
}
