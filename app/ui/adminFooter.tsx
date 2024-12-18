import Link from "next/link";
import { FaBook } from "react-icons/fa";

export default function AdminFooter() {
  return (
    <footer className="w-full bg-premium-background dark:bg-premium-secondaryDark text-premium-textSecondary dark:text-premium-textPlaceholder border-t border-premium-borderColor dark:border-premium-borderColorHover py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm px-4">
        {/* Copyrigth */}
        <span className="text-premium-textPrimary dark:text-premium-textSecondary text-center md:text-left">
          &copy; 2024 EdifiK - Administración. Todos los derechos reservados.
        </span>

        {/* Documentation */}
        <Link
          href="/admin/documentacion"
          className="flex items-center space-x-1 text-premium-primary dark:text-premium-primaryLight hover:text-premium-primaryDark dark:hover:text-premium-primaryDark transition-colors duration-300"
          aria-label="Documentación"
        >
          <FaBook size={20} />
          <span className="text-sm font-medium">Documentación</span>
        </Link>
      </div>
    </footer>
  );
}
