import type { Metadata } from "next";
import { ClientMyPropertiesPage } from "@/src/components/user";

export const metadata: Metadata = {
  title: "Mis Propiedades | EdifiK",
  description:
    "Gestiona tus propiedades publicadas, edita información y revisa el estado de cada una desde tu cuenta.",
};

export default function MyPropertiesPage() {
  return <ClientMyPropertiesPage />;
}
