"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User, HousePlus, Upload, LogOut, MonitorCog } from "lucide-react";
import type { Permission } from "@/src/interfaces";

interface DropDownMenuProps {
  onClose: () => void;
}

export function DropDownMenu({ onClose }: DropDownMenuProps) {
  const { data: session } = useSession();

  return (
    <div
      className="absolute right-0 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"
      role="menu"
    >
      <ul className="py-1 text-black">
        <li>
          <Link
            href="/usuario/perfil"
            onClick={onClose}
            className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
          >
            <User className="w-5 h-5 text-black" />
            Perfil
          </Link>
        </li>

        {session?.user?.permissions?.some(
          (perm: Permission) => perm.name !== "Gestionar propiedades propias"
        ) && (
          <li>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
            >
              <MonitorCog className="w-5 h-5 text-black" />
              Panel Administrador
            </Link>
          </li>
        )}

        {session?.user?.membershipId && (
          <li>
            <Link
              href="/usuario/mis-propiedades"
              onClick={onClose}
              className="flex items-center gap-3 w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-200 transition-all"
            >
              <HousePlus className="w-5 h-5 text-black" />
              Mis Propiedades
            </Link>
          </li>
        )}

        <li>
          <Link
            href="/usuario/subir-propiedad"
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
