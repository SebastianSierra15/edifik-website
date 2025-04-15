import type { Metadata } from "next";
import ClientEditPropertyPage from "@/app/ui/user/ClientEditPropertyPage";
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
    title: project?.name
      ? `Editar: ${project.name} | EdifiK`
      : "Editar Propiedad | EdifiK",
    description:
      project?.shortDescription ||
      "Edita los datos de tu propiedad publicada en EdifiK.",
    openGraph: {
      title: project?.name || "Editar Propiedad en EdifiK",
      description:
        project?.shortDescription ||
        "Edita tu propiedad publicada en la plataforma EdifiK.",
      url: `http://localhost:3000/usuario/${params.id}`,
      siteName: "EdifiK",
      type: "website",
    },
  };
}

export default function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClientEditPropertyPage />;
}
