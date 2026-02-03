import type { Metadata } from "next";
import { ClientRealEstatePage } from "@/src/components/realEstate";

export const metadata: Metadata = {
  title: `Inmobiliaria`,
  description:
    "Descubre propiedades en venta, arriendo y sobre planos con filtros, mapas, y toda la información que necesitas.",
};

export const dynamic = "force-dynamic";

export default function RealEstatePage() {
  return <ClientRealEstatePage />;
}
