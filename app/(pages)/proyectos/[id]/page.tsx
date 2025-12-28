import type { Metadata } from "next";
import ClientProject from "@/app/ui/projects/clientProject";
import { getProjectById } from "@/src/hooks/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = Number(params.id);
  const project = await getProjectById(id, true, false);

  return {
    title: project?.name ? `${project.name} | EdifiK` : "Proyecto | EdifiK",
    description:
      project?.shortDescription ||
      "Conoce este proyecto inmobiliario exclusivo de EdifiK.",
    openGraph: {
      title: project?.name || "Proyecto en EdifiK",
      description: project?.shortDescription || "Proyecto destacado en EdifiK.",
      url: `http://edifik.co/proyectos/${params.id}`,
      siteName: "EdifiK",
      type: "website",
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ClientProject id={params.id} />;
}
