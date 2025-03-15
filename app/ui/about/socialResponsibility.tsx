import Image from "next/image";
import { Check } from "lucide-react";

interface Point {
  title: string;
  description: string;
}

interface SocialResponsibilityProps {
  title: string;
  description: string;
  points: Point[];
  imageSrc: string;
  imagePosition: "left" | "right";
}

export default function SocialResponsibility({
  title,
  description,
  points,
  imageSrc,
  imagePosition,
}: SocialResponsibilityProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <section>
      <div className="mx-auto mb-10 px-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {isImageLeft && (
          <div className="mx-auto h-full grid grid-cols-1 gap-5 px-20 pt-5 w-full sm:px-0 lg:px-10">
            <Image
              className="h-full w-full self-stretch object-cover xl:self-stretch rounded-lg"
              src={imageSrc}
              alt={title}
              width={768}
              height={768}
              priority
            />
          </div>
        )}

        <div className="lg:mx-8 py-5">
          <div className="mb-10">
            <h2 className="mb-5 text-2xl font-semibold text-white md:text-4xl">
              {title}
            </h2>

            <p className="text-justify text-sm text-client-textPlaceholder md:text-base lg:text-left">
              {description}
            </p>
          </div>

          <div className="mx-auto grid gap-8 gap-y-4">
            {points.map((point, index) => (
              <div key={index} className="flex max-w-none flex-row">
                <div className="flex justify-center pt-1">
                  <Check
                    className="h-7 w-7 rounded-full bg-client-accent p-1 text-white"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="ml-2 text-xl leading-6 font-medium text-white md:text-3xl rtl:ml-0 rtl:mr-2">
                    {point.title}
                  </h3>

                  <p className="ml-2 mt-3 text-client-textPlaceholder rtl:ml-0 rtl:mr-2">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isImageLeft && (
          <div className="mx-auto h-full grid grid-cols-1 gap-5 px-20 pt-5 w-full sm:px-0 lg:px-10">
            <Image
              className="h-full w-full self-stretch object-cover xl:self-stretch rounded-lg"
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
