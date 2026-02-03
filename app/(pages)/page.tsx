import { Metadata } from "next";
import { BRAND } from "@/src/config";
import {
  AboutUsSection,
  HeroSection,
  ModelsSection,
  ProjectsSection,
  RealEstateSection,
  TestimonialCarousel,
  WordCarousel,
} from "@/src/components/home";
import { getHomeProjectsServer } from "@/src/hooks/projects";

export const metadata: Metadata = {
  title: `Inicio`,
  description: `Explora las mejores propiedades, proyectos y servicios inmobiliarios en un solo lugar con ${BRAND.name}.`,
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [companyProjects, realEstateProjects] = await Promise.all([
    getHomeProjectsServer(3, false),
    getHomeProjectsServer(4, true),
  ]);

  return (
    <div className="space-y-10 lg:space-y-12">
      <HeroSection
        srcImage="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/Modelos.webp"
        altImage="Imagen Inicio"
        title="Diseñamos sueños, Construimos realidades"
        description="Fusionamos diseño, emoción y estrategia para ayudarte a elegir y construir el espacio perfecto"
        objectPosition="top"
      />

      <WordCarousel />

      <ProjectsSection initialProjects={companyProjects ?? undefined} />

      <AboutUsSection />

      <RealEstateSection initialProjects={realEstateProjects ?? undefined} />

      <div className="px-6 sm:px-20 lg:px-28">
        <TestimonialCarousel />
      </div>

      <div className="px-6">
        <ModelsSection />
      </div>
    </div>
  );
}
