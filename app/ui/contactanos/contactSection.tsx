import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="bg-transparent p-5">
      <div className="mx-auto mb-10 grid grid-cols-1 gap-10 p-5 md:grid-cols-2 lg:p-10">
        {/* Imagen del constructor */}
        <div className="mx-auto grid w-3/4 grid-cols-1 gap-5 pt-5 lg:w-full lg:px-10">
          <Image
            className="h-auto w-full self-center object-cover xl:self-start"
            src="/images/constructor.jpg"
            alt="Imagen de arquitecto en obra"
            width={768}
            height={512}
            priority
          />
        </div>

        {/* Sección de contacto */}
        <div className="flex flex-col gap-10 px-2 pt-5 text-left">
          <div>
            <h3 className="mb-2 text-3xl font-semibold text-blue-600">
              Ponte en contacto
            </h3>
            <h2 className="mb-5 text-4xl font-semibold">
              ¿Tienes Preguntas? <br /> Escríbenos y te llamamos
            </h2>
          </div>

          <form className="space-y-4" aria-label="Formulario de contacto">
            <label htmlFor="name" className="sr-only">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nombre completo"
              required
              className="w-full rounded-md border border-gray-500 p-3 focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="phone" className="sr-only">
              Número de teléfono
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Número de teléfono"
              required
              className="w-full rounded-md border border-gray-500 p-3 focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
              required
              className="w-full rounded-md border border-gray-500 p-3 focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="message"
              placeholder="Mensaje"
              required
              className="h-32 w-full rounded-md border border-gray-500 p-3 focus:ring-2 focus:ring-blue-600"
            ></textarea>

            <button
              type="submit"
              className="w-1/3 rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
