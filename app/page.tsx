import { Metadata } from "next";
import HeroSection from "./ui/home/heroSection";
import WordCarousel from "./ui/home/wordCarousel";
import ProjectsSection from "./ui/home/projectsSection";
import AboutUsSection from "./ui/home/abaoutUsSection";
import RealEstateSection from "./ui/home/realEstateSection";
import TestimonialCarousel from "./ui/home/testimonialCarousel";
import ModelsSection from "./ui/home/modelsSection";

export const metadata: Metadata = {
  title: "Inicio | EdifiK",
  description:
    "Explora las mejores propiedades, proyectos y servicios inmobiliarios en un solo lugar con EdifiK.",
};

export default function Home() {
  return (
    <>
      <HeroSection
        srcImage="/images/home/home.webp"
        altImage="Vista del interior de un proyecto de EdifiK"
        title="Diseñamos sueños, Construimos realidades"
        description="Fusionamos diseño, emoción y estrategia para ayudarte a elegir y construir el espacio perfecto"
      />

      <WordCarousel />

      <ProjectsSection />

      <AboutUsSection />

      <RealEstateSection />

      <div className="px-6 sm:px-20 lg:px-28">
        <TestimonialCarousel />
      </div>

      <div className="px-6">
        <ModelsSection />
      </div>
    </>
  );
}
