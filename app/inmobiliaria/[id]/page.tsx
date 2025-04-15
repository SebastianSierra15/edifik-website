import type { Metadata } from "next";
import ClientProperty from "@/app/ui/realEstate/clientProperty";
import { getProjectById } from "@/app/data/serverProjectService";

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
      url: `http://localhost:3000/inmobiliaria/${params.id}`,
      siteName: "EdifiK",
      type: "website",
    },
  };
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <ClientProperty id={params.id} />;
}
