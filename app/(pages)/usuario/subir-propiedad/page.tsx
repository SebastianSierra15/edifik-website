"use client";

import { useSession } from "next-auth/react";
import Head from "next/head";
import PropertieForm from "@/app/ui/user/createEditProperties/propertieForm";

export default function UploadPropertyPage() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const hasPermission =
    session?.user?.permissions?.some(
      (perm) => perm.name === "Gestionar propiedades propias"
    ) || false;

  return (
    <>
      <Head>
        <title>Publicar Propiedad | EdifiK</title>
        <meta
          name="description"
          content="Crea tu anuncio en EdifiK. Publica propiedades fácilmente con fotos, precios, ubicación y más."
        />
      </Head>

      <PropertieForm isEdit={false} hasPermission={hasPermission} />
    </>
  );
}
