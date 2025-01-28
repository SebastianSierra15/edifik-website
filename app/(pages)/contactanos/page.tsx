import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import ContactSection from "../../ui/contact/contactSection";

interface ContactInfoProps {
  icon: JSX.Element;
  title: string;
  info: string;
  description?: string;
  py: string;
}

function ContactInfo({ icon, title, info, description, py }: ContactInfoProps) {
  return (
    <div className={`flex flex-col py-${py}`}>
      <div className="mb-4 flex items-center">
        <h3 className="ml-2 text-xl font-bold text-gray-800 md:text-2xl">
          {title}
        </h3>
      </div>
      <div className="mb-5 ml-4 mt-0 w-1/5 border-t border-gray-400"></div>
      <div className="ml-5 flex flex-row gap-5">
        {icon}
        <div className="flex flex-col">
          <h4 className="mb-3 font-bold text-gray-800">{info}</h4>
          {description && <p>{description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Banner Section */}
      <div className="relative h-[500px] w-full bg-cover bg-center">
        <Image
          src="/images/image1.png"
          alt="Imagen de contacto de EdifiK"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-center text-5xl text-white lg:text-7xl">
            Contáctanos
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactSection />

      <hr className="mx-auto my-2 w-5/6 border-t border-gray-400 bg-transparent" />

      {/* Contact Information Section */}
      <div className="py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-10 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-8">
          <ContactInfo
            icon={
              <FaMapMarkerAlt
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            }
            title="Oficina Central"
            info="Fusagasugá, Cundinamarca"
            description="Calle 14 #3-59 Conjunto Parque la colina Bloque E - 801"
            py="6"
          />
          <ContactInfo
            icon={
              <FaPhoneAlt
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            }
            title="Llámanos"
            info="+57 312 345 6789"
            description="Lun - Sab: 08am - 06pm"
            py="8"
          />
          <ContactInfo
            icon={
              <FaEnvelope
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            }
            title="Correo Electrónico"
            info="EdifiK.arquitectos23@gmail.com"
            py="10"
          />
        </div>
      </div>

      <hr className="mx-auto my-2 w-5/6 border-t border-gray-400 bg-transparent" />

      {/* Map Section */}
      <div className="py-10">
        <div id="map" className="h-96 w-full"></div>{" "}
        {/* Asegura que el mapa tenga altura definida */}
      </div>
    </main>
  );
}
