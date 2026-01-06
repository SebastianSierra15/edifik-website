import clsx from "clsx";
import Image from "next/image";

interface CertificationCardProps {
  title: string;
  description: string;
  imageSrc: string;
  bgColor: string;
}

export function CertificationCard({
  title,
  description,
  imageSrc,
  bgColor,
}: CertificationCardProps) {
  return (
    <div className="col-span-3 mx-auto flex w-full md:col-span-1">
      <div
        className={clsx(
          "flex w-full flex-col justify-between rounded-lg border px-6 py-8 text-center shadow border-white",
          bgColor
        )}
      >
        <div className="px-2 py-0">
          <h3 className="mb-5 text-center text-white text-xl font-semibold uppercase leading-6 tracking-wider md:text-3xl">
            {title}
          </h3>

          <p className="text-justify font-light text-client-primaryLight">
            {description}
          </p>
        </div>

        <div className="mt-8 justify-center text-center">
          <Image
            src={imageSrc}
            alt={`Certificado de ${title}`}
            width={500}
            height={150}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
