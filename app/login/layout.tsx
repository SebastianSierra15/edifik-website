import { inter } from "@/app/fonts/fonts";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-client-background antialiased`}
    >
      {children}
    </div>
  );
}
