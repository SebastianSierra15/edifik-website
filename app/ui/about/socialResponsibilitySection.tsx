import Image from "next/image";
//import { FaCheck } from "react-icons/fa";

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
    <section className="bg-transparent p-5">
      <div
        className={`mx-auto mb-10 grid grid-cols-1 gap-2 p-5 md:grid-cols-2 lg:gap-10 lg:p-10`}
      >
        {/* Condicional para mostrar la imagen a la izquierda o derecha */}
        {isImageLeft && (
          <div className="mx-auto grid w-3/4 grid-cols-1 gap-5 px-0 pt-5 lg:w-full lg:px-10">
            <Image
              className="h-auto w-full self-center object-cover xl:self-start"
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
            <h2 className="mb-10 text-2xl font-semibold text-blue-600 md:text-4xl">
              {title}
            </h2>
            <p className="text-justify text-sm text-gray-700 md:text-base lg:text-left">
              {description}
            </p>
          </div>

          <div className="mx-auto grid gap-8 gap-y-4">
            {points.map((point, index) => (
              <div key={index} className="flex max-w-none flex-row">
                <div className="flex justify-center pt-1">
                  <FaCheck
                    className="h-7 w-7 rounded-full bg-green-600 p-1 text-gray-50 dark:bg-green-700"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="ml-2 text-xl leading-6 text-blue-600 md:text-3xl rtl:ml-0 rtl:mr-2">
                    {point.title}
                  </h3>
                  <p className="ml-2 mt-3 text-gray-700 rtl:ml-0 rtl:mr-2">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isImageLeft && (
          <div className="mx-auto grid w-3/4 grid-cols-1 gap-5 px-0 pt-5 lg:w-full lg:px-10">
            <Image
              className="h-auto w-full self-center object-cover xl:self-start"
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
