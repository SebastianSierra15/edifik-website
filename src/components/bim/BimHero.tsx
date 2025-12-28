import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function BimHero() {
  return (
    <section className="relative w-full h-[550px] sm:h-[500px] lg:h-[510px]">
      <Image
        src="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia2.webp"
        alt="BIM"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 flex flex-col justify-between h-full px-6 pt-8 sm:py-8">
        <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold max-w-[500px] mt-12">
          MODELOS A MEDIDA
        </h1>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center sm:items-end w-full gap-6 sm:gap-0 mb-2 sm:mb-8 pt-4 lg:pt-0">
          <Link
            href="https://wa.me/573001112233"
            target="_blank"
            className="bg-client-secondary p-2 rounded-full shadow-lg"
          >
            <div className="group flex items-center bg-white rounded-full pl-5 pr-2 py-1 gap-2 hover:bg-gray-200 transition opacity-100">
              <span className="text-sm font-semibold text-client-primary">
                Saber más
              </span>

              <div className="bg-client-background text-white p-2 rounded-full">
                <ArrowUpRight className="w-4 h-4 hover:scale-110 transition" />
              </div>
            </div>
          </Link>

          <Link
            href="/proyectos"
            className="bg-white rounded-xl p-4 shadow-lg flex flex-col gap-2 w-[250px]"
          >
            <h2 className="text-client-primary font-semibold text-lg text-center">
              Proyectos Recientes
            </h2>

            <div className="w-full h-24 bg-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Vista Aérea/1732917151017/817a91d1-50f1-4418-b2e0-f5f1f2eac80c.webp"
                alt="img1"
                width={200}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="w-full h-24 bg-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Exterior/1738097483989/2d82574a-54ee-416d-ba08-24b19eabc3ec.webp"
                alt="img2"
                width={200}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-40" />
    </section>
  );
}
