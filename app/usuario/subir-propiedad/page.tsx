import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { ClientUploadPropertyPage } from "@/src/components/user";
import { Permission, requireAuthWithPermissions } from "@/src/modules/auth";

export const metadata: Metadata = {
  title: `Publicar Propiedad`,
  description: `Sube una propiedad en pocos pasos. Agrega fotos, precios, ubicación y comienza a recibir contactos en ${BRAND.name}.`,
};

export default async function Page() {
  const session = await requireAuthWithPermissions([
    Permission.ManageOwnProperties,
  ]);
  const hasPermission =
    session.user.permissions?.some(
      (perm) => perm.name === Permission.ManageOwnProperties
    ) || false;

  return <ClientUploadPropertyPage hasPermission={hasPermission} />;
}
