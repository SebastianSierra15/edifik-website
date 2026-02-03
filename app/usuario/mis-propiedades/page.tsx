import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { ClientMyPropertiesPage } from "@/src/components/user";

export const metadata: Metadata = {
  title: `Mis Propiedades`,
  description: `Gestiona tus propiedades publicadas, edita información y revisa el estado de cada una desde tu cuenta en ${BRAND.name}.`,
};

export const dynamic = "force-dynamic";

export default function MyPropertiesPage() {
  return <ClientMyPropertiesPage />;
}
