import Image from "next/image";
import ContactForm from "./contactForm";

export default function ContactSection() {
  return (
    <section>
      <div className="mx-auto mb-10 grid grid-cols-1 gap-10 px-5 md:grid-cols-2 lg:px-10">
        <div className="mx-auto grid w-3/4 grid-cols-1 gap-5 pt-5 lg:w-full lg:px-10">
          <Image
            className="h-auto w-full self-center object-cover xl:self-start rounded-lg"
            src="/images/constructor.jpg"
            alt="Imagen de arquitecto en obra"
            width={768}
            height={512}
            priority
          />
        </div>

        <div className="flex flex-col gap-10 px-2 pt-5 text-left">
          <div>
            <h3 className="mb-2 text-3xl font-semibold text-client-accent">
              Ponte en contacto
            </h3>

            <h2 className="mb-5 text-4xl font-semibold text-white">
              ¿Tienes Preguntas? <br /> Escríbenos y te llamamos
            </h2>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
