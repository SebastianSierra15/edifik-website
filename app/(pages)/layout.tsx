import type { Metadata } from "next";
import { poppins } from "@/app/ui/fonts";
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
        className={`${poppins.className} flex min-h-screen flex-col bg-premium-background antialiased dark:bg-premium-background`}
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
