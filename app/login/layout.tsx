import type { Metadata } from "next";
import { inter } from "@/app/fonts/fonts";
import { Providers } from "../providers";
import "../globals.css";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión para acceder a EdifiK",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-client-background antialiased`}
      >
        <Providers>
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
