import type { Metadata } from "next";

import { BRAND } from "@/src/config";
import { AlertProvider, ConfirmationProvider } from "@/src/providers";
import { AdminHeader, AdminFooter } from "@/src/components/layout";

export const metadata: Metadata = {
  title: `Admin`,
  description: `Panel de administracion de ${BRAND.name}.`,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertProvider>
      <ConfirmationProvider>
        <div className="min-h-screen bg-premium-background antialiased flex flex-col">
          <AdminHeader />
          <main className="flex-grow pt-20 flex flex-col">{children}</main>
          <AdminFooter />
        </div>
      </ConfirmationProvider>
    </AlertProvider>
  );
}
