import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { getProjectById } from "@/src/hooks/projects";
import { ClientEditPropertyPage } from "@/src/components/user";
import { Permission, requireAuthWithPermissions } from "@/src/modules/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);
  const project = await getProjectById(projectId, false, false);

  return {
    title: project?.name ? `Editar: ${project.name}` : `Editar Propiedad`,
    description:
      project?.shortDescription ||
      `Edita los datos de tu propiedad publicada en ${BRAND.name}.`,
    openGraph: {
      title: project?.name || `Editar Propiedad en ${BRAND.name}`,
      description:
        project?.shortDescription ||
        `Edita tu propiedad publicada en la plataforma ${BRAND.name}.`,
      url: `${BRAND.appUrl}/usuario/${id}`,
      siteName: BRAND.name,
      type: "website",
    },
  };
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuthWithPermissions([
    Permission.ManageOwnProperties,
  ]);
  const hasPermission =
    session.user.permissions?.some(
      (perm) => perm.name === Permission.ManageOwnProperties
    ) || false;

  return (
    <ClientEditPropertyPage projectId={id} hasPermission={hasPermission} />
  );
}
