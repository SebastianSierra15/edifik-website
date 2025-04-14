"use client";

import dynamic from "next/dynamic";
import { Project } from "@/lib/definitios";

import ProjectHeaderSkeleton from "@/app/ui/skeletons/projectHeaderSkeleton";
import { ProjectCarouselSkeleton } from "@/app/ui/skeletons/projectCarouselSkeleton";
import { ProjectPlansSkeleton } from "@/app/ui/skeletons/projectPlansSkeleton";
import ProjectDetailsSkeleton from "@/app/ui/skeletons/projectDetailsSkeleton";
import { ProjectNearbyServicesSkeleton } from "@/app/ui/skeletons/projectNearbyServicesSkeleton";
import { ProjectCommonAreasSkeleton } from "@/app/ui/skeletons/projectCommonAreasSkeleton";

const ProjectHeader = dynamic(
  () => import("@/app/ui/realEstate/project/projectHeader"),
  { loading: () => <ProjectHeaderSkeleton /> }
);

const ProjectCarousel = dynamic(
  () => import("@/app/ui/realEstate/project/projectCarousel"),
  { loading: () => <ProjectCarouselSkeleton /> }
);

const ProjectPlans = dynamic(
  () => import("@/app/ui/realEstate/project/projectPlans"),
  { loading: () => <ProjectPlansSkeleton /> }
);

const ProjectDetails = dynamic(
  () => import("@/app/ui/realEstate/project/projectDetails"),
  { loading: () => <ProjectDetailsSkeleton /> }
);

const ProjectNearbyServices = dynamic(
  () => import("@/app/ui/realEstate/project/projectNearbyServices"),
  { loading: () => <ProjectNearbyServicesSkeleton /> }
);

const ProjectCommonAreas = dynamic(
  () => import("@/app/ui/realEstate/project/projectCommonAreas"),
  { loading: () => <ProjectCommonAreasSkeleton /> }
);

const ProjectLocation = dynamic(
  () => import("@/app/ui/realEstate/project/projectLocation"),
  { loading: () => <ProjectCommonAreasSkeleton /> }
);

const ContactFormSection = dynamic(
  () => import("@/app/ui/realEstate/project/contactFormSection"),
  {
    loading: () => <div>Cargando formulario de contacto...</div>,
  }
);

interface ProjectViewProps {
  project: Project;
}

export default function ProjectView({ project }: ProjectViewProps) {
  return (
    <div className="bg-client-backgroundLight">
      <ProjectHeader project={project} />

      <ProjectCarousel
        projectMedia={project.projectMedia.filter(
          (media) => media.imageType !== null && media.imageType !== 1005
        )}
      />

      <div className="mt-4 flex justify-center">
        <hr className="mt-4 w-3/4 border-t border-white" />
      </div>

      <div className="grid grid-cols-1 gap-4 pt-8 lg:grid-cols-3">
        <div className="px-4 sm:px-6 lg:px-12 lg:col-span-2 lg:pr-10">
          {project.projectMedia.filter((media) => media.imageType === 1005)
            .length > 0 && (
            <ProjectPlans
              projectMedia={project.projectMedia.filter(
                (media) => media.imageType === 1005
              )}
            />
          )}

          <p className="my-8 text-lg text-client-text">
            {project.shortDescription}
          </p>

          <ProjectDetails project={project} />

          <div className="my-8 text-base">
            <h2 className="mb-2 text-2xl font-semibold text-white">
              Descripción General
            </h2>

            <p className="whitespace-pre-line text-client-text">
              {project.detailedDescription}
            </p>
          </div>

          {project.nearbyServices && project.nearbyServices.length > 0 && (
            <ProjectNearbyServices services={project.nearbyServices} />
          )}

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
        </div>

        <div className="pr-16 pt-8">
          <ContactFormSection />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-12">
        <ProjectLocation
          latitude={project.latitude}
          longitude={project.longitude}
          address={project.address}
        />
      </div>
    </div>
  );
}
