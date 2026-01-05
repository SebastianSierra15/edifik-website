import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { getProjectById } from "@/src/hooks/projects";
import { ClientProject } from "@/src/components/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);
  const project = await getProjectById(projectId, true, false);

  return {
    title: project?.name ? `${project.name}` : `Proyecto`,
    description:
      project?.shortDescription ||
      `Conoce este proyecto inmobiliario exclusivo de ${BRAND.name}.`,
    openGraph: {
      title: project?.name || `Proyecto en ${BRAND.name}`,
      description:
        project?.shortDescription || `Proyecto destacado en ${BRAND.name}.`,
      url: `${BRAND.appUrl}/proyectos/${id}`,
      siteName: BRAND.name,
      type: "website",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  const project = await getProjectById(projectId, true, false);

  return <ClientProject id={id} initialProject={project ?? undefined} />;
}
