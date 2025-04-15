import { inter } from "@/app/fonts/fonts";
import { Providers } from "../providers";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-client-background antialiased`}
    >
      <Providers>{children}</Providers>
    </div>
  );
}
