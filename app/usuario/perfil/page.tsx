import { Metadata } from "next";
import { BRAND } from "@/src/config";
import { ClientProfilePage } from "@/src/components/profile";

export const metadata: Metadata = {
  title: `Mi perfil`,
  description: `Actualiza tu información personal en tu perfil de usuario en ${BRAND.name}.`,
};

export default function ProfilePage() {
  return <ClientProfilePage />;
}
