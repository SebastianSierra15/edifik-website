import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="p-5 lg:px-10 lg:pb-10 mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2 text-client-text">
      <div className="mx-8 text-center lg:text-left">
        <h1 className="mb-10 text-3xl font-bold text-client-text lg:text-5xl">
          Te damos la bienvenida a EdifiK
        </h1>

        <h2 className="mb-10 text-xl font-medium lg:text-4xl">
          ¿Quiénes Somos?
        </h2>

        <p className="text-justify text-sm lg:text-base text-client-textPlaceholder">
          Somos EdifiK, tu socio ideal en diseño y desarrollo de proyectos
          arquitectónicos. Especializados en metodología BIM, nos dedicamos a
          crear y planificar cada etapa de tu proyecto con precisión y
          eficiencia. Desde el modelado y renderizado hasta la planificación
          detallada, garantizamos soluciones innovadoras que transforman tus
          ideas en realidades tangibles. Con EdifiK, cada proyecto es una
          oportunidad para plasmar tus ideas y volverlas realidad.
        </p>
      </div>

      <div className="mx-auto grid grid-cols-1 justify-center gap-5 text-center">
        <Image
          className="self-center object-cover rounded-lg"
          src="/images/services-11.jpg"
          alt="Arquitecto trabajando"
          width={400}
          height={300}
          priority
        />
      </div>
    </section>
  );
}
