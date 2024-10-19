import Image from "next/image";

interface VisionMisionSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  bgColor: string;
  textColor: string;
}

export default function VisionMisionSection({
  title,
  description,
  imageSrc,
  bgColor,
  textColor,
}: VisionMisionSectionProps) {
  return (
    <div
      className={`col-span-3 mx-auto flex w-full overflow-hidden md:col-span-1`}
    >
      <div
        className={`flex flex-col justify-between px-6 py-8 text-center border rounded-lg shadow ${bgColor} border-blue-700`}
      >
        <h3
          className={`mb-5 text-xl font-semibold uppercase tracking-wider ${textColor}`}
        >
          {title}
        </h3>
        <p className="text-sm font-light text-gray-700 text-justify">
          {description}
        </p>
        <div className="justify-center text-center mt-5">
          <Image
            className="self-center object-cover"
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
