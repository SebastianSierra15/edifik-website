"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import Loader from "./loader";

const libraries: ("places" | "marker")[] = ["places", "marker"];

export default function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
