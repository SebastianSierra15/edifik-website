import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "../globals.css";
import Header from "../ui/header";
import Footer from "../ui/footer";

export const metadata: Metadata = {
  title: "EdifiK",
  description: "Somos la mejor opción para tu vivienda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased bg-gray-100 min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
