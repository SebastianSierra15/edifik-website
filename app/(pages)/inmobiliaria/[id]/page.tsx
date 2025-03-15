"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import Map from "@/app/ui/admin/projects/project/map";

import ProjectHeaderSkeleton from "@/app/ui/skeletons/projectHeaderSkeleton";
import { ProjectCarouselSkeleton } from "@/app/ui/skeletons/projectCarouselSkeleton";
import { ProjectPlansSkeleton } from "@/app/ui/skeletons/projectPlansSkeleton";
import ProjectDetailsSkeleton from "@/app/ui/skeletons/projectDetailsSkeleton";
import { ProjectNearbyServicesSkeleton } from "@/app/ui/skeletons/projectNearbyServicesSkeleton";
import { ProjectCommonAreasSkeleton } from "@/app/ui/skeletons/projectCommonAreasSkeleton";
import { ProjectShortDescriptionSkeleton } from "@/app/ui/skeletons/projectShortDescriptionSkeleton";
import { ProjectDetailedDescriptionSkeleton } from "@/app/ui/skeletons/projectDetailedDescriptionSkeleton";

const ProjectHeader = dynamic(
  () => import("@/app/ui/admin/projects/project/projectHeader"),
  { loading: () => <ProjectHeaderSkeleton /> }
);

const ProjectCarousel = dynamic(
  () => import("@/app/ui/admin/projects/project/projectCarousel"),
  { loading: () => <ProjectCarouselSkeleton /> }
);

const ProjectPlans = dynamic(
  () => import("@/app/ui/admin/projects/project/projectPlans"),
  { loading: () => <ProjectPlansSkeleton /> }
);

const ProjectDetails = dynamic(
  () => import("@/app/ui/admin/projects/project/projectDetails"),
  { loading: () => <ProjectDetailsSkeleton /> }
);

const ProjectNearbyServices = dynamic(
  () => import("@/app/ui/admin/projects/project/projectNearbyServices"),
  { loading: () => <ProjectNearbyServicesSkeleton /> }
);

const ProjectCommonAreas = dynamic(
  () => import("@/app/ui/admin/projects/project/projectCommonAreas"),
  { loading: () => <ProjectCommonAreasSkeleton /> }
);

const ContactForm = dynamic(
  () => import("@/app/ui/admin/projects/contactForm"),
  {
    loading: () => <div>Cargando formulario de contacto...</div>,
  }
);

const CarouselRecommendedProjects = dynamic(
  () => import("@/app/ui/admin/projects/project/carouselRecommendedProjects"),
  { loading: () => <div>Cargando propiedades recomendados...</div> }
);

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id ? decodeURIComponent(params.id as string) : "";

  const { project, projectRecommended, loading } = useProjectById(
    Number(projectId)
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#EDEDED", color: "#5D4037" }}
    >
      <Head>
        <title>{project?.name || "Cargando propiedad..."} - EdifiK</title>
        <meta
          property="og:title"
          content={project?.name || "Cargando propiedad..."}
        />
        <meta
          property="og:description"
          content={
            project?.shortDescription ||
            "Descubre este increíble propiedad con EdifiK"
          }
        />
        <meta
          property="og:url"
          content={`https://tu-dominio.com/propiedades/${params.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EdifiK" />
      </Head>

      {loading ? (
        <>
          <ProjectHeaderSkeleton />

          <ProjectCarouselSkeleton />

          <div className="mt-4 flex justify-center">
            <hr
              className="w-3/4"
              style={{
                borderTop: "2px solid #DAA520",
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-8 lg:grid-cols-3">
            <div className="space-y-8 px-16 lg:col-span-2 lg:pr-10">
              <ProjectPlansSkeleton />

              <ProjectShortDescriptionSkeleton />

              <ProjectDetailsSkeleton />

              <ProjectDetailedDescriptionSkeleton />

              <ProjectNearbyServicesSkeleton />

              <ProjectCommonAreasSkeleton />

              <div className="h-80 w-full animate-pulse rounded bg-gray-300" />
            </div>

            <div className="pr-16 pt-8 transition-all duration-300">
              <ContactForm />
            </div>
          </div>
        </>
      ) : (
        project && (
          <>
            <ProjectHeader project={project} />

            <ProjectCarousel
              projectMedia={project.projectMedia.filter(
                (media) => media.imageType !== null && media.imageType !== 1005
              )}
            />

            <div className="mt-4 flex justify-center">
              <hr
                className="w-3/4"
                style={{
                  borderTop: "2px solid #DAA520",
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-8 lg:grid-cols-3">
              <div className="px-4 sm:px-6 lg:col-span-2 lg:px-12 lg:pr-10">
                <ProjectPlans
                  projectMedia={project.projectMedia.filter(
                    (media) => media.imageType === 1005
                  )}
                />

                <p className="my-8 text-lg" style={{ color: "#000000" }}>
                  {project.shortDescription}
                </p>

                <ProjectDetails project={project} />

                <div className="my-8 text-base">
                  <h2
                    className="mb-2 text-2xl font-semibold"
                    style={{ color: "#8B4513" }}
                  >
                    Descripción General
                  </h2>
                  <p className="whitespace-pre-line text-black">
                    {project.detailedDescription}
                  </p>
                </div>

                <ProjectNearbyServices services={project.nearbyServices} />

                {project.commonAreas && project.commonAreas.length > 0 && (
                  <div>
                    <ProjectCommonAreas
                      areas={project.commonAreas}
                      projectMedia={project.projectMedia.filter(
                        (media) => media.commonArea !== null
                      )}
                    />
                  </div>
                )}

                <Map
                  coordinates={{
                    lat: project.longitude,
                    lng: project.latitude,
                  }}
                  address={project.address}
                  isLoaded
                />
              </div>

              <div className="pr-16 pt-8">
                <ContactForm />
              </div>
            </div>

            {/*
            <div className="mx-32 mt-20">
              <CarouselRecommendedProjects projects={projectRecommended} />
            </div>*/}
          </>
        )
      )}
    </div>
  );
}
