import type { Metadata } from "next";
import { poppins } from "@/app/ui/fonts";
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
        className={`${poppins.className} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
