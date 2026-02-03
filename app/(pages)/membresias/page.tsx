import { Metadata } from "next";
import { ClientMembershipsPage } from "@/src/components/memberships";

export const metadata: Metadata = {
  title: `Membresías`,
  description:
    "Activa una membresía para publicar más propiedades, mejorar tu visibilidad y acceder a herramientas premium.",
};

export const dynamic = "force-dynamic";

export default function MembershipsPage() {
  return <ClientMembershipsPage />;
}
