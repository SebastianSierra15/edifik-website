"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import ProjectView from "@/app/ui/realEstate/project/projectView";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";
  const { project } = useProjectById(Number(projectId), true);

  return (
    <div className="bg-client-backgroundLight">
      <Head>
        <title>{project?.name || "Cargando proyecto..."} - EdifiK</title>
        <meta
          property="og:title"
          content={project?.name || "Cargando proyecto..."}
        />
        <meta
          property="og:description"
          content={
            project?.shortDescription ||
            "Descubre esta increíble proyecto con EdifiK"
          }
        />
        <meta
          property="og:url"
          content={`https://tu-dominio.com/proyectos/${params.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EdifiK" />
      </Head>

      {project && <ProjectView project={project} />}
    </div>
  );
}
