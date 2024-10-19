import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: "EdifiK",
  description: "Somos la mejor opción para tu vivienda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
