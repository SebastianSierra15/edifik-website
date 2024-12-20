import type { Metadata } from "next";
import { poppins } from "@/app/ui/fonts";
import { Providers } from "../providers";
import AdminHeader from "../ui/adminHeader";
import AdminFooter from "../ui/adminFooter";
import "../globals.css";

export const metadata: Metadata = {
  title: "EdifiK Admin",
  description: "Panel de administración de EdifiK",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.className} antialiased bg-premium-background dark:bg-premium-background min-h-screen flex flex-col`}
      >
        <Providers>
          <AdminHeader />
          <main className="flex-grow">{children}</main>
          <AdminFooter />
        </Providers>
      </body>
    </html>
  );
}
