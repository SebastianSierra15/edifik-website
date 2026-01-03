import type { Metadata } from "next";
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
    title: project?.name ? `${project.name} | EdifiK` : "Proyecto | EdifiK",
    description:
      project?.shortDescription ||
      "Conoce este proyecto inmobiliario exclusivo de EdifiK.",
    openGraph: {
      title: project?.name || "Proyecto en EdifiK",
      description: project?.shortDescription || "Proyecto destacado en EdifiK.",
      url: `http://edifik.co/proyectos/${id}`,
      siteName: "EdifiK",
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
