import { useSession } from "next-auth/react";
import Link from "next/link";
import { CircleUserRound, Menu } from "lucide-react";

export default function UserMenu({
  toggleMenu,
  toggleSidebar,
}: {
  toggleMenu: () => void;
  toggleSidebar: () => void;
}) {
  const { data: session } = useSession();

  return (
    <div className="bg-client-background flex items-center space-x-1 px-1 py-1 rounded-full">
      {session ? (
        <>
          <Link
            href="/usuario/subir-propiedad"
            className="text-client-text px-4 md:px-2 lg:px-4 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Subir Propiedad
          </Link>

          <button
            onClick={() => {
              if (window.innerWidth >= 768) {
                toggleMenu();
              } else {
                toggleSidebar();
              }
            }}
            className="bg-white text-black px-3 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
            type="button"
            aria-haspopup="menu"
          >
            <Menu className="h-6 w-6 transition-colors duration-200 hover:text-gray-500" />
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="hidden lg:block text-client-text px-2 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Iniciar Sesión
          </Link>

          <Link
            href="/login/register"
            className="bg-white text-black px-2 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Registrarse ↗
          </Link>

          <Link
            href="/login"
            title="Iniciar Sesión"
            className="block lg:hidden text-client-text px-2 py-2 rounded-full hover:bg-gray-800 transition"
          >
            <CircleUserRound />
          </Link>

          <button
            onClick={() => {
              toggleSidebar();
            }}
            type="button"
            aria-haspopup="menu"
            className="block -ml-1 md:hidden text-client-text px-2 py-2 rounded-full hover:bg-gray-800 transition"
          >
            <Menu />
          </button>
        </>
      )}
    </div>
  );
}
