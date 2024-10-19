import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="p-5 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto mb-10 p-5 lg:p-10">
        {/* Imagen del constructor */}
        <div className="grid grid-cols-1 gap-5 pt-5 lg:px-10 mx-auto w-3/4 lg:w-full">
          <Image
            className="w-full h-auto object-cover self-center xl:self-start"
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
            <h3 className="text-3xl font-semibold text-blue-600 mb-2">
              Ponte en contacto
            </h3>
            <h2 className="text-4xl font-semibold mb-5">
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
              className="w-full p-3 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="phone" className="sr-only">
              Número de teléfono
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Número de teléfono"
              required
              className="w-full p-3 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
              required
              className="w-full p-3 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-600"
            />

            <label htmlFor="message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="message"
              placeholder="Mensaje"
              required
              className="w-full h-32 p-3 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-600"
            ></textarea>

            <button
              type="submit"
              className="w-1/3 p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
