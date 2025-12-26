"use client";

import dynamic from "next/dynamic";
import type { LocationMapProps } from "./LocationMapClient";

const LocationMapClient = dynamic(
  () => import("./LocationMapClient").then((mod) => mod.LocationMapClient),
  { ssr: false }
);

export function LocationMap(props: LocationMapProps) {
  return <LocationMapClient {...props} />;
}

export type { LocationMapProps };
