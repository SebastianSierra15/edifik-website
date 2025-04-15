import type { Metadata } from "next";
import ClientUploadPropertyPage from "@/app/ui/user/clientUploadPropertyPage";

export const metadata: Metadata = {
  title: "Publicar Propiedad | EdifiK",
  description:
    "Sube una propiedad en pocos pasos. Agrega fotos, precios, ubicación y comienza a recibir contactos.",
};

export default function Page() {
  return <ClientUploadPropertyPage />;
}
