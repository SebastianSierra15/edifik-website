import { Footer, Header } from "@/src/components/layout";
import { AlertProvider, ClientConfirmationProvider } from "@/src/providers";
import { requireAuthWithPermissions } from "@/src/modules/auth";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthWithPermissions([]);

  return (
    <AlertProvider>
      <ClientConfirmationProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </ClientConfirmationProvider>
    </AlertProvider>
  );
}
