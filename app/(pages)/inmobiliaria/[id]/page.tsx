import type { Metadata } from "next";
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
    title: project?.name ? `${project.name} | EdifiK` : "Propiedad | EdifiK",
    description:
      project?.shortDescription ||
      "Descubre esta increíble propiedad con EdifiK.",
    openGraph: {
      title: project?.name || "Propiedad en EdifiK",
      description:
        project?.shortDescription || "Propiedad destacada en EdifiK.",
      url: `http://edifik.co/inmobiliaria/${id}`,
      siteName: "EdifiK",
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
