"use client";

import Head from "next/head";
//import { motion } from "framer-motion";
import { useProjectByName } from "@/app/hooks/projects/useProjectById";
import ProjectHeader from "@/app/ui/projects/project/projectHeader";
import ProjectCarousel from "@/app/ui/projects/project/projectCarousel";
import ProjectPlans from "@/app/ui/projects/project/projectPlans";
import ProjectDetails from "@/app/ui/projects/project/projectDetails";
import ProjectNearbyServices from "@/app/ui/projects/project/projectNearbyServices";
import ProjectCommonAreas from "@/app/ui/projects/project/projectCommonAreas";
import ContactForm from "@/app/ui/projects/contactForm";
import CarouselRecommendedProjects from "@/app/ui/projects/project/carouselRecommendedProjects";

import ProjectHeaderSkeleton from "@/app/ui/skeletons/projectHeaderSkeleton";
import { ProjectCarouselSkeleton } from "@/app/ui/skeletons/projectCarouselSkeleton";
import { ProjectPlansSkeleton } from "@/app/ui/skeletons/projectPlansSkeleton";
import ProjectDetailsSkeleton from "@/app/ui/skeletons/projectDetailsSkeleton";
import { ProjectNearbyServicesSkeleton } from "@/app/ui/skeletons/projectNearbyServicesSkeleton";
import { ProjectCommonAreasSkeleton } from "@/app/ui/skeletons/projectCommonAreasSkeleton";
import { ProjectShortDescriptionSkeleton } from "@/app/ui/skeletons/projectShortDescriptionSkeleton";
import { ProjectDetailedDescriptionSkeleton } from "@/app/ui/skeletons/projectDetailedDescriptionSkeleton";

import Map from "@/app/ui/projects/project/map";

export default function ProjectPage({ params }: { params: { name: string } }) {
  const { project, projectRecommended, loading } = useProjectByName(
    params.name
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#EDEDED", color: "#5D4037" }}
    >
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
            "Descubre este increíble proyecto con EdifiK"
          }
        />
        <meta
          property="og:url"
          content={`https://tu-dominio.com/proyectos/${params.name}`}
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

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="pr-16 pt-8 transition-all duration-300"
            >
              <ContactForm />
            </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <ProjectPlans
                    projectMedia={project.projectMedia.filter(
                      (media) => media.imageType === 1005
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="my-8 text-lg" style={{ color: "#000000" }}>
                    {project.shortDescription}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <ProjectDetails project={project} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
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
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.2 }}
                >
                  <ProjectNearbyServices services={project.nearbyServices} />
                </motion.div>

                {project.commonAreas && project.commonAreas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <ProjectCommonAreas
                      areas={project.commonAreas}
                      projectMedia={project.projectMedia.filter(
                        (media) => media.commonArea !== null
                      )}
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Map
                    latitude={project.latitude}
                    longitude={project.longitude}
                    address={project.address}
                  />
                </motion.div>
              </div>

              <div className="pr-16 pt-8">
                <ContactForm />
              </div>
            </div>

            <div className="mx-32 mt-20">
              <CarouselRecommendedProjects projects={projectRecommended} />
            </div>
          </>
        )
      )}
    </div>
  );
}
