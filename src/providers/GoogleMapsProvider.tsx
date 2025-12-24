"use client";

import type { ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader } from "@/src/components/shared/Loader";

const libraries: ("places" | "marker")[] = ["places", "marker"];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
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
