import dynamic from "next/dynamic";
import ContactInfo from "./contactInfo";

const MapPin = dynamic(() => import("lucide-react").then((mod) => mod.MapPin));
const Phone = dynamic(() => import("lucide-react").then((mod) => mod.Phone));
const Mail = dynamic(() => import("lucide-react").then((mod) => mod.Mail));

export default function ContactDetailsSection() {
  return (
    <>
      <div className="mx-auto grid sm:justify-normal max-w-7xl grid-cols-1 gap-0 px-4 sm:px-6 lg:px-12 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-8">
        <ContactInfo
          icon={
            <MapPin className="h-6 w-6 text-client-accent" aria-hidden="true" />
          }
          title="Oficina Central"
          info="Fusagasugá, Cundinamarca"
          description="Calle 14 #3-59 Conjunto Parque la Colina Bloque E - 801"
          py="6"
        />

        <ContactInfo
          icon={
            <Phone className="h-6 w-6 text-client-accent" aria-hidden="true" />
          }
          title="Llámanos"
          info="+57 312 345 6789"
          description="Lun - Sab: 08am - 06pm"
          py="8"
        />

        <ContactInfo
          icon={
            <Mail className="h-6 w-6 text-client-accent" aria-hidden="true" />
          }
          title="Correo Electrónico"
          info="EdifiK.arquitectos23@gmail.com"
          py="10"
        />
      </div>
    </>
  );
}
