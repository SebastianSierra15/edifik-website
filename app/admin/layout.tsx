import type { Metadata } from "next";
import { montserrat } from "@/app/ui/fonts";
import "../globals.css";
import AdminHeader from "../ui/adminHeader";
import AdminFooter from "../ui/adminFooter";

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
        className={`${montserrat.className} antialiased bg-background dark:bg-background min-h-screen flex flex-col`}
      >
        <AdminHeader />
        <main className="flex-grow">{children}</main>
        <AdminFooter />
      </body>
    </html>
  );
}
