import { Metadata } from "next";
import ClientMembershipsPage from "../ui/memberships/clientMembershipsPage";

export const metadata: Metadata = {
  title: "Membresías | EdifiK",
  description:
    "Activa una membresía para publicar más propiedades, mejorar tu visibilidad y acceder a herramientas premium.",
};

export default function MembershipsPage() {
  return <ClientMembershipsPage />;
}
