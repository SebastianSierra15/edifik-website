import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pt-5 pb-1 bg-gray-800 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-7">
        {/* Ubicación */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Ubícanos</h3>
          <address>
            <p>Fusagasugá - Cundinamarca, Calle 14 #3-59</p>
            <p>Conjunto Parque la colina</p>
            <p>Bloque E - 801</p>
            <Link
              href="mailto:EdifiK_arquitectos23@gmail.com"
              className="text-blue-500 hover:underline"
              aria-label="Enviar correo a EdifiK"
            >
              EdifiK_arquitectos23@gmail.com
            </Link>
          </address>
        </div>

        {/* Sobre Nosotros */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
            Sobre Nosotros
          </h3>
          <ul>
            {["Quienes Somos", "Blog", "Trabaja en EdifiK"].map(
              (text, index) => (
                <li key={index}>
                  <Link href="#" className="hover:underline">
                    {text}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Enlaces útiles */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
            Enlaces útiles
          </h3>
          <ul>
            <li>
              <Link href="#" className="hover:underline">
                Centro de ayuda
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Contacto</h3>
          <p>+57 123 456 7890</p>
        </div>
      </div>

      <div className="container mx-auto mt-10 border-t border-gray-600 px-7 pt-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Términos y Política */}
          <div className="text-sm text-center md:text-left md:mb-0">
            {[
              "Términos y condiciones",
              "Cookies",
              "Política de privacidad",
              "Mapa del sitio",
            ].map((text, index) => (
              <span key={index}>
                {index > 0 && " • "}
                <Link href="#" className="mx-2 hover:underline">
                  {text}
                </Link>
              </span>
            ))}
          </div>

          {/* Redes Sociales */}
          <div className="flex space-x-4">
            {[
              {
                href: "https://www.facebook.com",
                icon: FaFacebook,
                label: "Facebook",
              },
              {
                href: "https://www.instagram.com",
                icon: FaInstagram,
                label: "Instagram",
              },
              { href: "https://www.x.com", icon: FaTwitter, label: "Twitter" },
              {
                href: "https://www.tiktok.com",
                icon: FaTiktok,
                label: "TikTok",
              },
              {
                href: "https://www.youtube.com",
                icon: FaYoutube,
                label: "YouTube",
              },
              {
                href: "https://www.whatsapp.com",
                icon: FaWhatsapp,
                label: "WhatsApp",
              },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="hover:text-blue-700"
                aria-label={`EdifiK en ${label}`}
                passHref
              >
                <Icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
