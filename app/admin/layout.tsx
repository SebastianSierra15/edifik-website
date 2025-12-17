import AdminHeader from "@/src/components/layout/admin/AdminHeader";
import AdminFooter from "@/src/components/layout/admin/AdminFooter";
import { inter } from "@/app/fonts/fonts";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-premium-background antialiased flex flex-col`}
    >
      <AdminHeader />

      <main className="flex-grow pt-16 flex flex-col gap-12">{children}</main>

      <AdminFooter />
    </div>
  );
}
