"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/src/components/shared";

interface ContactMapProps {
  coordinates: { lat: number; lng: number };
}

const ContactMapLeaflet = dynamic(
  () => import("./ContactMapLeaflet").then((mod) => mod.ContactMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full h-full">
        <Loader size={48} />
      </div>
    ),
  }
);

export function ContactMap({ coordinates }: ContactMapProps) {
  return <ContactMapLeaflet coordinates={coordinates} />;
}
