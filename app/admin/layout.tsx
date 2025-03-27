import type { Metadata } from "next";
import { inter } from "@/app/fonts/fonts";
import { Providers } from "../providers";
import AdminHeader from "../ui/admin/adminHeader";
import AdminFooter from "../ui/admin/adminFooter";
import GoogleMapsProvider from "../ui/googleMapsProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "EdifiK Admin",
  description: "Panel de administración de EdifiK",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-premium-background antialiased dark:bg-premium-background`}
      >
        <Providers>
          <GoogleMapsProvider>
            <AdminHeader />
            <main className="flex-grow">{children}</main>
            <AdminFooter />
          </GoogleMapsProvider>
        </Providers>
      </body>
    </html>
  );
}
