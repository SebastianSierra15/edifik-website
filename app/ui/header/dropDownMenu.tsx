"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, Bell, HousePlus, Upload, LogOut } from "lucide-react";

interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {
  return (
    <div
      className="absolute right-0 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"
      role="menu"
    >
      <ul className="py-1 text-black">
        <li>
          <Link
            href="/perfil"
            onClick={onClose}
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
          >
            <User className="w-5 h-5 text-black" />
            Perfil
          </Link>
        </li>

        <li>
          <Link
            href="/notificaciones"
            onClick={onClose}
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
          >
            <Bell className="w-5 h-5 text-black" />
            Notificaciones
          </Link>
        </li>

        <li>
          <Link
            href="/mis-propiedades"
            onClick={onClose}
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
          >
            <HousePlus className="w-5 h-5 text-black" />
            Mis Propiedades
          </Link>
        </li>

        <li>
          <Link
            href="/subir-propiedad"
            onClick={onClose}
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
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
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
          >
            <LogOut className="w-5 h-5 text-black" />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
