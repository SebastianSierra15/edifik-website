"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import ProjectView from "@/app/ui/realEstate/project/projectView";

export default function PropertyPage() {
  const params = useParams();
  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";
  const { project } = useProjectById(Number(projectId), false);

  return (
    <div className="bg-client-backgroundLight">
      <Head>
        <title>{project?.name || ""} | EdifiK</title>
        <meta property="og:title" content={project?.name || ""} />
        <meta
          property="og:description"
          content={
            project?.shortDescription ||
            "Descubre esta increíble propiedad con EdifiK"
          }
        />
        <meta
          property="og:url"
          content={`https://edifik.co/propiedades/${params.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EdifiK" />
      </Head>

      {project && <ProjectView project={project} />}
    </div>
  );
}
