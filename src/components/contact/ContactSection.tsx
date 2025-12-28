import Image from "next/image";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section>
      <div className="mx-auto mb-10 grid grid-cols-1 gap-4 md:gap-10 px-4 sm:px-6 lg:px-12 md:grid-cols-2">
        <div className="h-full w-full md:py-14">
          <Image
            src="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia7.webp"
            alt="Edificio San Carlos Florencia"
            width={500}
            height={600}
            className="h-full w-full object-cover rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col gap-10 px-2 pt-5 text-left">
          <div>
            <h3 className="mb-2 text-3xl font-semibold text-client-accent">
              Ponte en contacto
            </h3>

            <h2 className="md:mb-5 text-4xl font-semibold text-white">
              ¿Tienes Preguntas? <br /> Escríbenos y te llamamos
            </h2>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
