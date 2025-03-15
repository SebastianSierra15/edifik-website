import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  X,
  Home,
  Building2,
  Briefcase,
  Store,
  User,
  Bell,
  HousePlus,
  Upload,
  LogOut,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-client-text shadow-lg transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <span className="text-lg font-semibold text-black">Menú</span>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="py-2 text-black">
          <li className="px-6 text-sm font-semibold text-premium-textSecondary uppercase">
            EdifiK
          </li>

          <li>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
            >
              <Home className="w-5 h-5 text-black" />
              Inicio
            </Link>
          </li>

          <li>
            <Link
              href="/proyectos"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
            >
              <Building2 className="w-5 h-5 text-black" />
              Proyectos
            </Link>
          </li>

          <li>
            <Link
              href="/bim"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
            >
              <Briefcase className="w-5 h-5 text-black" />
              BIM
            </Link>
          </li>

          <li>
            <Link
              href="/inmobiliaria"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
            >
              <Store className="w-5 h-5 text-black" />
              Inmobiliaria
            </Link>
          </li>

          {session && (
            <>
              <hr className="border-gray-300 my-2" />

              <li className="px-6 text-sm font-semibold text-premium-textSecondary uppercase">
                Usuario
              </li>

              <li>
                <Link
                  href="/perfil"
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
                >
                  <User className="w-5 h-5 text-black" />
                  Perfil
                </Link>
              </li>

              <li>
                <Link
                  href="/notificaciones"
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
                >
                  <Bell className="w-5 h-5 text-black" />
                  Notificaciones
                </Link>
              </li>

              <li>
                <Link
                  href="/mis-propiedades"
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
                >
                  <HousePlus className="w-5 h-5 text-black" />
                  Mis Propiedades
                </Link>
              </li>

              <li>
                <Link
                  href="/subir-propiedad"
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 hover:bg-gray-200 transition-all"
                >
                  <Upload className="w-5 h-5 text-black" />
                  Subir Propiedad
                </Link>
              </li>

              <hr className="border-gray-300 my-2" />

              <li>
                <button
                  onClick={() => {
                    onClose();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-3 w-full text-left px-6 py-3 font-medium hover:bg-gray-200 transition-all"
                >
                  <LogOut className="w-5 h-5 text-black" />
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
