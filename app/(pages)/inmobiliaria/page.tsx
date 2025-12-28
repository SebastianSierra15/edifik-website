import type { Metadata } from "next";
import ClientRealEstatePage from "@/app/ui/realEstate/clientRealStatePage";

export const metadata: Metadata = {
  title: "Inmobiliaria | EdifiK",
  description:
    "Descubre propiedades en venta, arriendo y sobre planos con filtros, mapas, y toda la información que necesitas.",
};

export default function RealEstatePage() {
  return <ClientRealEstatePage />;
}
