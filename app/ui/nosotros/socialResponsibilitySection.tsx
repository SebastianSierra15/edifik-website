import Image from "next/image";
import { FaCheck } from "react-icons/fa";

interface Point {
  title: string;
  description: string;
}

interface SocialResponsibilitySectionProps {
  title: string;
  description: string;
  points: Point[];
  imageSrc: string;
  imagePosition: "left" | "right";
}

export default function SocialResponsibilitySection({
  title,
  description,
  points,
  imageSrc,
  imagePosition,
}: SocialResponsibilitySectionProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <section className="p-5 bg-transparent">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-10 mx-auto mb-10 p-5 lg:p-10`}
      >
        {/* Condicional para mostrar la imagen a la izquierda o derecha */}
        {isImageLeft && (
          <div className="grid grid-cols-1 gap-5 pt-5 px-0 lg:px-10 mx-auto w-3/4 lg:w-full">
            <Image
              className="self-center xl:self-start w-full h-auto object-cover"
              src={imageSrc}
              alt={title}
              width={768}
              height={768}
              priority
            />
          </div>
        )}

        <div className="mx-8 py-5 text-left">
          <div className="mb-10">
            <h2 className="mb-10 text-2xl md:text-4xl font-semibold text-blue-600">
              {title}
            </h2>
            <p className="text-gray-700 text-sm md:text-base text-justify lg:text-left">
              {description}
            </p>
          </div>

          <div className="mx-auto grid gap-8 gap-y-4">
            {points.map((point, index) => (
              <div key={index} className="flex flex-row max-w-none">
                <div className="flex justify-center pt-1">
                  <FaCheck
                    className="bg-green-600 dark:bg-green-700 text-gray-50 h-7 w-7 rounded-full p-1"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="leading-6 ml-2 text-xl md:text-3xl rtl:ml-0 rtl:mr-2 text-blue-600">
                    {point.title}
                  </h3>
                  <p className="mt-3 ml-2 rtl:ml-0 rtl:mr-2 text-gray-700">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isImageLeft && (
          <div className="grid grid-cols-1 gap-5 pt-5 px-0 lg:px-10 mx-auto w-3/4 lg:w-full">
            <Image
              className="self-center xl:self-start w-full h-auto object-cover"
              src={imageSrc}
              alt={title}
              width={768}
              height={768}
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
