import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { getProjectById } from "@/src/hooks/projects";
import { ClientProperty } from "@/src/components/realEstate";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  const project = await getProjectById(numericId, false, false);

  return {
    title: project?.name ? `${project.name}` : `Propiedad`,
    description:
      project?.shortDescription ||
      `Descubre esta increíble propiedad con ${BRAND.name}.`,
    openGraph: {
      title: project?.name || `Propiedad en ${BRAND.name}`,
      description:
        project?.shortDescription || `Propiedad destacada en ${BRAND.name}.`,
      url: `${BRAND.appUrl}/inmobiliaria/${id}`,
      siteName: BRAND.name,
      type: "website",
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientProperty id={id} />;
}
