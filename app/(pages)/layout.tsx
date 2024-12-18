import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import Header from "../ui/header";
import Footer from "../ui/footer";
import { Providers } from "../providers";
import "../globals.css";

export const metadata: Metadata = {
  title: "EdifiK",
  description: "Bienvenido a EdifiK",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased bg-premium-background dark:bg-premium-background min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
