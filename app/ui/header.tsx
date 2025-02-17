"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./userMenu";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-gray-100 bg-opacity-70 text-black shadow-md backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Inicio"
        >
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={100}
            height={40}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <nav
          className="hidden space-x-6 md:flex"
          aria-label="Navegación principal"
        >
          {[
            "/",
            "/nosotros",
            "/proyectos",
            "/bim",
            "/inmobiliaria",
            "/contactanos",
          ].map((path, index) => {
            const labels = [
              "Inicio",
              "Nosotros",
              "Proyectos",
              "BIM",
              "Inmobiliaria",
              "Contactanos",
            ];
            return (
              <Link
                key={path}
                href={path}
                className={
                  pathname === path
                    ? "font-semibold text-blue-600"
                    : "hover:text-blue-700"
                }
                aria-current={pathname === path ? "page" : undefined}
              >
                {labels[index]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
