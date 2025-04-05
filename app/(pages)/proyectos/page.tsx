"use client";

import { useGetBasicProjects } from "@/app/hooks/projects/basic/useGetBasicProjects";
import HeroSection from "@/app/ui/home/heroSection";
import ProjectsShowcase from "@/app/ui/projects/projectsShowcase";
import ProjectSkeletonList from "@/app/ui/skeletons/projectSkeletonList";
import { ProjectView } from "@/lib/definitios";

export default function ProjectPage() {
  const { projects, isLoading } = useGetBasicProjects();

  const staticProjects: ProjectView[] = Array.from(
    { length: 8 },
    (_, index) => ({
      id: 1000 + index,
      name: `Proyecto Estático ${index + 1}`,
      cityName: "Florencia",
      price: 300000000 + index * 10000000,
      area: 80 + index * 5,
      bathrooms: 2,
      parkingSpots: 1,
      bedrooms: 3,
      images: [
        {
          projectId: 1000 + index,
          url: [
            "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Oficina/1184/Previsualización/1739223319337/32610d5d-1b85-444f-b639-75000a182f92.webp",
            "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Lote/1183/Previsualización/1739196512465/3bf19008-d212-4517-bfc0-c8c9bd0d75a7.webp",
            "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Local/1182/Previsualización/1739135799491/59bc8a98-b78c-4f09-9d2f-edc5fdfe9e1f.webp",
            "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1171/Previsualización/1738259098424/b089c576-06e0-4922-b176-3a58316c9f14.webp",
            "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Finca/1176/Previsualización/1738461644899/00365cc9-353f-47d2-87c1-0c729b80ea40.webp",
          ][index % 5],
          tag: "previsualizacion",
        },
      ],
    })
  );

  return (
    <div>
      <HeroSection
        srcImage="/images/home/home.webp"
        altImage="Nuestros proyectos"
        title="Proyectos"
        description="Conoce nuestros proyectos"
      />

      {isLoading ? (
        <ProjectSkeletonList />
      ) : projects.length > 0 ? (
        <div className="px-6 py-10">
          {projects
            .reduce(
              (acc, _, index) => {
                if (index % 4 === 0) {
                  acc.push(projects.slice(index, index + 4));
                }
                return acc;
              },
              [] as (typeof projects)[]
            )
            .map((projectGroup, index, array) => (
              <div key={index}>
                <ProjectsShowcase
                  projects={projectGroup}
                  reverse={index % 2 === 1}
                />

                {index < array.length - 1 && (
                  <hr className="mx-auto my-6 w-5/6 border-t border-white bg-transparent" />
                )}
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No hay proyectos disponibles.
        </p>
      )}
    </div>
  );
}
