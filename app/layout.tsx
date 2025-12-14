import { inter } from "@/app/fonts/fonts";
import { Providers } from "./providers";
import GoogleMapsProvider from "./ui/googleMapsProvider";
import LayoutWrapper from "./ui/layoutWrapper";
import type { Metadata } from "next";
import { BRAND } from "@/src/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: {
    siteName: BRAND.name,
    url: BRAND.appUrl,
    type: "website",
  },
};

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
