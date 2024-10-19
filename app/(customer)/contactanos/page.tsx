import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import ContactSection from "../../ui/contactanos/contactSection";

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
      <div className="flex items-center mb-4">
        <h3 className="ml-2 text-xl md:text-2xl font-bold text-gray-800">
          {title}
        </h3>
      </div>
      <div className="border-t mt-0 mb-5 ml-4 w-1/5 border-gray-400"></div>
      <div className="flex flex-row gap-5 ml-5">
        {icon}
        <div className="flex flex-col">
          <h4 className="font-bold mb-3 text-gray-800">{info}</h4>
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
      <div className="relative w-full h-[500px] bg-cover bg-center">
        <Image
          src="/images/image1.png"
          alt="Imagen de contacto de EdifiK"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-white text-5xl lg:text-7xl text-center">
            Contáctanos
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactSection />

      <hr className="border-t bg-transparent border-gray-400 my-2 mx-auto w-5/6" />

      {/* Contact Information Section */}
      <div className="py-8">
        <div className="max-w-7xl px-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4 lg:gap-8">
          <ContactInfo
            icon={
              <FaMapMarkerAlt
                className="w-6 h-6 text-blue-600"
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
                className="w-6 h-6 text-blue-600"
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
                className="w-6 h-6 text-blue-600"
                aria-hidden="true"
              />
            }
            title="Correo Electrónico"
            info="EdifiK.arquitectos23@gmail.com"
            py="10"
          />
        </div>
      </div>

      <hr className="border-t bg-transparent border-gray-400 my-2 mx-auto w-5/6" />

      {/* Map Section */}
      <div className="py-10">
        <div id="map" className="w-full h-96"></div>{" "}
        {/* Asegura que el mapa tenga altura definida */}
      </div>
    </main>
  );
}
