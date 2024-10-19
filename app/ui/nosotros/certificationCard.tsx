import Image from "next/image";

interface CertificationCardProps {
  title: string;
  description: string;
  imageSrc: string;
  bgColor: string;
}

export default function CertificationCard({
  title,
  description,
  imageSrc,
  bgColor,
}: CertificationCardProps) {
  return (
    <div className="flex mx-auto w-full col-span-3 md:col-span-1">
      <div
        className={`flex w-full flex-col border px-6 py-8 rounded-lg text-center shadow justify-between ${bgColor} border-blue-700`}
      >
        <div className="px-2 py-0">
          <h3 className="mb-5 text-xl md:text-3xl font-semibold leading-6 text-center uppercase tracking-wider">
            {title}
          </h3>
          <p className="font-light text-gray-700 text-justify">{description}</p>
        </div>
        <div className="mt-8 justify-center text-center">
          <Image
            src={imageSrc}
            alt={`Certificado de ${title}`}
            width={500}
            height={150}
            className="mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
