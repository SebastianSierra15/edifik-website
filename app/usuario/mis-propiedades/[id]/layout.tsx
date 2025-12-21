import GoogleMapsProvider from "@/app/ui/googleMapsProvider";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleMapsProvider>{children}</GoogleMapsProvider>;
}
