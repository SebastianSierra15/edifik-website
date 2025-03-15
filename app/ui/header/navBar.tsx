"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", label: "Inicio" },
  { path: "/proyectos", label: "Proyectos" },
  { path: "/bim", label: "BIM" },
  { path: "/inmobiliaria", label: "Inmobiliaria" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex space-x-2 px-2 lg:px-4 py-2 rounded-full bg-gray-300/50 backdrop-blur-md shadow-md"
      aria-label="Navegación principal"
    >
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={`px-2 lg:px-4 py-1 rounded-full transition font-medium ${
            pathname === path
              ? "bg-white text-black"
              : "text-gray-800 hover:text-black"
          }`}
          aria-current={pathname === path ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
