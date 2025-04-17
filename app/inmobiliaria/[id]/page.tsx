import type { Metadata } from "next";
import { getProjectById } from "@/app/data/serverProjectService";
import ClientProperty from "@/app/ui/realEstate/clientProperty";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = Number(params.id);
  const project = await getProjectById(id, false, false);

  return {
    title: project?.name ? `${project.name} | EdifiK` : "Propiedad | EdifiK",
    description:
      project?.shortDescription ||
      "Descubre esta increíble propiedad con EdifiK.",
    openGraph: {
      title: project?.name || "Propiedad en EdifiK",
      description:
        project?.shortDescription || "Propiedad destacada en EdifiK.",
      url: `http://edifik.co/inmobiliaria/${params.id}`,
      siteName: "EdifiK",
      type: "website",
    },
  };
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <ClientProperty id={params.id} />;
}
