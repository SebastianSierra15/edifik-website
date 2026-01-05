import { Metadata } from "next";
import { ClientProfilePage } from "@/src/components/profile";

export const metadata: Metadata = {
  title: "Mi perfil | EdifiK",
  description: "Actualiza tu información personal en tu perfil de usuario.",
};

export default function ProfilePage() {
  return <ClientProfilePage />;
}
