import { GoogleMapsProvider } from "@/src/providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GoogleMapsProvider>{children}</GoogleMapsProvider>;
}
