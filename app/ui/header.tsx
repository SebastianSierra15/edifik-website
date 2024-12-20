"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import UserMenuButton from "./login/userMenuButton";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-100 bg-opacity-70 backdrop-blur-md shadow-md text-black">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
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
          className="hidden md:flex space-x-6"
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
                    ? "text-blue-600 font-semibold"
                    : "hover:text-blue-700"
                }
                aria-current={pathname === path ? "page" : undefined}
              >
                {labels[index]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4 text-black">
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
            { href: "https://www.tiktok.com", icon: FaTiktok, label: "TikTok" },
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
              className="hover:text-blue-600"
              aria-label={`EdifiK en ${label}`}
            >
              <Icon size={24} />
            </Link>
          ))}

          <UserMenuButton />
        </div>
      </div>
    </header>
  );
}
