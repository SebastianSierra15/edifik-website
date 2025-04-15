import type { Metadata } from "next";
import { inter } from "@/app/fonts/fonts";
import AdminHeader from "../ui/admin/adminHeader";
import AdminFooter from "../ui/admin/adminFooter";
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
    <div
      className={`${inter.className} min-h-screen bg-premium-background antialiased`}
    >
      <main className="flex-grow">{children}</main>
    </div>
  );
}
