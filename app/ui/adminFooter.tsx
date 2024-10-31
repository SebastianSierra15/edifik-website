import Link from "next/link";
import { FaTools, FaUserShield, FaChartLine } from "react-icons/fa";

export default function AdminFooter() {
  return (
    <footer className="pt-5 pb-1 bg-secondary dark:bg-secondaryDark text-textSecondary dark:text-textPlaceholder transition-colors duration-300">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-7">
        {/* Herramientas Administrativas */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primaryLight mb-4">
            Herramientas Administrativas
          </h3>
          <ul className="flex flex-col items-center md:items-start">
            <li className="flex items-center space-x-2 mb-2">
              <FaChartLine className="text-primary dark:text-primaryLight" />
              <Link
                href="/admin/dashboard"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Panel de Control
              </Link>
            </li>
            <li className="flex items-center space-x-2 mb-2">
              <FaUserShield className="text-primary dark:text-primaryLight" />
              <Link
                href="/admin/usuarios"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Gestión de Usuarios
              </Link>
            </li>
          </ul>
        </div>

        {/* Soporte y Contacto */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primaryLight mb-4">
            Soporte
          </h3>
          <ul>
            <li>
              <Link
                href="/admin/help"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Centro de ayuda
              </Link>
            </li>
            <li>
              <Link
                href="/admin/docs"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Documentación
              </Link>
            </li>
          </ul>
        </div>

        {/* Accesos Directos */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primaryLight mb-4">
            Accesos Directos
          </h3>
          <ul>
            <li>
              <Link
                href="/admin/propiedades"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reservas"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Reservas
              </Link>
            </li>
            <li>
              <Link
                href="/admin/estadias"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Estadías
              </Link>
            </li>
          </ul>
        </div>

        {/* Enlaces Legales */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primaryLight mb-4">
            Enlaces Legales
          </h3>
          <ul>
            <li>
              <Link
                href="/admin/terms"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/admin/privacy"
                className="hover:underline hover:text-primary dark:hover:text-primaryLight"
              >
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-6 border-t border-borderColor dark:border-borderColorHover px-7 pt-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Información de Copyright */}
          <div className="text-sm text-center md:text-left">
            <span>
              &copy; 2024 EdifiK - Administración. Todos los derechos
              reservados.
            </span>
          </div>

          {/* Herramientas Rápidas */}
          <div className="flex space-x-4">
            {[
              { href: "/admin/tools", icon: FaTools, label: "Herramientas" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-primary dark:hover:text-primaryLight"
                aria-label={label}
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
