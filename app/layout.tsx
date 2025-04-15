import { inter } from "@/app/fonts/fonts";
import { Providers } from "./providers";
import GoogleMapsProvider from "./ui/googleMapsProvider";
import LayoutWrapper from "./ui/layoutWrapper";
import "./globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-client-background antialiased`}
      >
        <Providers>
          <GoogleMapsProvider>
            <LayoutWrapper>
              <main className="flex flex-col flex-grow gap-12">{children}</main>
            </LayoutWrapper>
          </GoogleMapsProvider>
        </Providers>
      </body>
    </html>
  );
}
