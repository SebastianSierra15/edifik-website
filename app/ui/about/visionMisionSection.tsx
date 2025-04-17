import VisionMisionCard from "./visionMisionCard";

export default function VisionMisionSection() {
  return (
    <section
      id="mision-vision"
      className="px-4 py-8 md:p-10 -translate-y-10 bg-client-backgroundLight"
    >
      <div className="bg-transparent mx-auto pt-44 md:pt-16 lg:pt-8 py-12">
        <div className="max-w-3xl text-center md:mx-auto md:pt-10">
          <h2 className="text-2xl font-semibold text-client-text md:text-4xl">
            Nuestra Visión y Misión
          </h2>

          <hr className="mx-auto my-2 w-1/3 border-t border-white" />
        </div>

        <div className="mt-14 flex items-stretch justify-center md:mt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <VisionMisionCard
              title="Visión"
              description="Ser una empresa referente en Colombia y Latinoamérica en el desarrollo de proyectos arquitectónicos e inmobiliarios integrales, reconocida por su innovación, su enfoque humano y su capacidad de transformar ideas en realidades tangibles.
              Aspiramos a consolidarnos como una marca confiable, estratégica y emocionalmente cercana, que une el diseño con el negocio, la arquitectura con el bienestar, y la construcción con la experiencia de vivir."
              imageSrc="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/about/Mision.webp"
              bgColor="bg-client-secondaryLight"
            />

            <VisionMisionCard
              title="Misión"
              description="En Edifik, somos una empresa de arquitectura e inmobiliaria que diseña, construye y comercializa espacios con propósito.
              Combinamos la creatividad del diseño arquitectónico, la eficiencia constructiva y la inteligencia del mercado inmobiliario para ofrecer soluciones completas, sostenibles y emocionalmente conectadas.
              Nuestro compromiso es acompañar a cada cliente desde la idea hasta la entrega, desde el diseño hasta la venta, creando espacios que se habitan, se valoran y se sienten."
              imageSrc="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/about/Vision2.webp"
              bgColor="bg-client-accentLight"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
