import { Metadata } from "next";
import ClientProfilePage from "@/app/ui/profile/clientProfilePage";

export const metadata: Metadata = {
  title: "Mi perfil | EdifiK",
  description: "Actualiza tu información personal en tu perfil de usuario.",
};

export default function ProfilePage() {
  return <ClientProfilePage />;
}
