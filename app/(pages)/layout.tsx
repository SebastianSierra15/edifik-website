import type { Metadata } from "next";
import { inter } from "@/app/fonts/fonts";
import { Providers } from "../providers";
import Header from "../ui/header/header";
import Footer from "../ui/footer/footer";
import GoogleMapsProvider from "../ui/googleMapsProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "EdifiK",
  description: "Bienvenido a EdifiK",
};

export default function Layout({
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
          <Header />
          <GoogleMapsProvider>
            <main className="flex flex-col flex-grow gap-12">{children}</main>
          </GoogleMapsProvider>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
