import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BRAND } from "@/src/config";

export const metadata: Metadata = {
  title: `Detalle de propiedad | ${BRAND.name}`,
  description: `Revisa la informacion de tu propiedad y su estado de publicacion en ${BRAND.name}.`,
};

export default function UserPropertyDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
