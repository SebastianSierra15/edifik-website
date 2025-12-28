import type { Metadata } from "next";
import ClientMyPropertiesPage from "@/app/ui/user/clientMyPropertiesPage";

export const metadata: Metadata = {
  title: "Mis Propiedades | EdifiK",
  description:
    "Gestiona tus propiedades publicadas, edita información y revisa el estado de cada una desde tu cuenta.",
};

export default function MyPropertiesPage() {
  return <ClientMyPropertiesPage />;
}
