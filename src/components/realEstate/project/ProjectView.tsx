"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { ProjectDetails } from "@/src/interfaces";
import { useIsLgUp } from "@/src/hooks/ui";

import { getYouTubeEmbedUrl } from "@/utils";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectPlansSkeleton } from "./ProjectPlansSkeleton";
import { ProjectDetailsSkeleton } from "./ProjectDetailsSkeleton";
import { ProjectNearbyServicesSkeleton } from "./ProjectNearbyServicesSkeleton";
import { ProjectCommonAreasSkeleton } from "./ProjectCommonAreasSkeleton";

const ProjectPlans = dynamic(
  () => import("./ProjectPlans").then((mod) => mod.ProjectPlans),
  { loading: () => <ProjectPlansSkeleton /> },
);

const ProjectDetails = dynamic(
  () => import("./ProjectDetails").then((mod) => mod.ProjectDetails),
  { loading: () => <ProjectDetailsSkeleton /> },
);

const ProjectNearbyServices = dynamic(
  () =>
    import("./ProjectNearbyServices").then((mod) => mod.ProjectNearbyServices),
  { loading: () => <ProjectNearbyServicesSkeleton /> },
);

const ProjectCommonAreas = dynamic(
  () => import("./ProjectCommonAreas").then((mod) => mod.ProjectCommonAreas),
  { loading: () => <ProjectCommonAreasSkeleton /> },
);

const ProjectLocation = dynamic(
  () => import("./ProjectLocation").then((mod) => mod.ProjectLocation),
  { loading: () => <ProjectCommonAreasSkeleton /> },
);

const ContactFormSection = dynamic(
  () => import("./ContactFormSection").then((mod) => mod.ContactFormSection),
  {
    loading: () => <div>Cargando formulario de contacto...</div>,
  },
);

interface ProjectViewProps {
  project: ProjectDetails;
}

export function ProjectView({ project }: ProjectViewProps) {
  const locationRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const isLgUp = useIsLgUp();
  const projectMedia = useMemo(
    () => project.projectMedia ?? [],
    [project.projectMedia],
  );
  const galleryMedia = useMemo(
    () =>
      projectMedia.filter(
        (media) => media.imageType !== null && media.imageType !== 1005,
      ),
    [projectMedia],
  );
  const planMedia = useMemo(
    () => projectMedia.filter((media) => media.imageType === 1005),
    [projectMedia],
  );
  const commonAreaMedia = useMemo(
    () => projectMedia.filter((media) => media.commonArea !== null),
    [projectMedia],
  );
  const videoEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(project.videoUrl),
    [project.videoUrl],
  );

  return (
    <div className="bg-client-backgroundLight pb-6">
      <ProjectHeader project={project} />

      <ProjectCarousel projectMedia={galleryMedia} />

      <div className="mt-4 flex justify-center">
        <hr className="mt-4 w-3/4 border-t border-white" />
      </div>

      <div className="grid grid-cols-1 gap-4 pt-8 lg:grid-cols-3">
        <div className="px-4 sm:px-6 lg:px-12 lg:col-span-2 lg:pr-10">
          {planMedia.length > 0 && <ProjectPlans projectMedia={planMedia} />}

          <p className="my-8 text-lg text-client-text break-words">
            {project.shortDescription}
          </p>

          <ProjectDetails project={project} />

          <div className="my-8 text-base">
            <h2 className="mb-2 text-2xl font-semibold text-white">
              Descripción General
            </h2>

            <p className="whitespace-pre-line text-client-text break-words">
              {project.detailedDescription}
            </p>
          </div>

          {videoEmbedUrl && (
            <div className="my-8 text-base">
              <h2 className="mb-2 text-2xl font-semibold text-white">
                {project.projectType?.id === 1
                  ? "Video del Proyecto"
                  : "Video de la Propiedad"}
              </h2>
              <div className="overflow-hidden rounded-md">
                <iframe
                  src={videoEmbedUrl}
                  title="Video del proyecto"
                  className="h-64 w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {project.nearbyServices && project.nearbyServices.length > 0 && (
            <ProjectNearbyServices services={project.nearbyServices} />
          )}

          {project.commonAreas && project.commonAreas.length > 0 && (
            <div>
              <ProjectCommonAreas
                areas={project.commonAreas}
                projectMedia={commonAreaMedia}
              />
            </div>
          )}
        </div>

        {isLgUp && (
          <div
            className="hidden lg:block relative pr-7 pt-8"
            ref={formWrapperRef}
          >
            <ContactFormSection
              locationRef={locationRef}
              wrapperRef={formWrapperRef}
              propertyId={project.id}
              propertyName={project.name}
              toEmail={
                project.email ?? process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? ""
              }
              phoneNumber={
                project.phoneNumber ??
                process.env.NEXT_PUBLIC_COMPANY_PHONE ??
                ""
              }
            />
          </div>
        )}
      </div>

      <div ref={locationRef} className="px-4 sm:px-6 lg:px-12">
        <ProjectLocation
          latitude={project.latitude}
          longitude={project.longitude}
          address={project.address}
        />
      </div>

      {!isLgUp && (
        <div className="block px-4 sm:px-6 lg:hidden mt-8">
          <ContactFormSection
            locationRef={locationRef}
            wrapperRef={formWrapperRef}
            propertyId={project.id}
            propertyName={project.name}
            toEmail={
              project.email ?? process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? ""
            }
            phoneNumber={
              project.phoneNumber ?? process.env.NEXT_PUBLIC_COMPANY_PHONE ?? ""
            }
          />
        </div>
      )}
    </div>
  );
}
