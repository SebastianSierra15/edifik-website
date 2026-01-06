import { inter } from "@/app/fonts/fonts";
import { AlertProvider } from "@/src/providers";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-client-background antialiased`}
    >
      <AlertProvider>{children}</AlertProvider>
    </div>
  );
}
