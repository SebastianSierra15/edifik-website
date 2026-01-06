"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { path: "/", label: "Inicio" },
  { path: "/proyectos", label: "Proyectos" },
  { path: "/bim", label: "BIM" },
  { path: "/inmobiliaria", label: "Inmobiliaria" },
];

export function NavBar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive =
      path === "/" ? pathname === "/" : pathname.startsWith(path);

    return isActive ? "bg-white text-black" : "text-gray-800 hover:text-black";
  };

  return (
    <nav
      className="flex space-x-2 px-2 lg:px-4 py-2 rounded-full bg-gray-300/50 backdrop-blur-md shadow-md"
      aria-label="Navegación principal"
    >
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={clsx(
            "px-2 lg:px-4 py-1 rounded-full transition font-medium",
            getLinkClasses(path)
          )}
          aria-current={
            (path === "/" && pathname === "/") ||
            (path !== "/" && pathname.startsWith(path))
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
