import { Metadata } from "next";
import BimHero from "@/app/ui/bim/bimHero";
import BrandsShowcase from "@/app/ui/bim/brandsShowcase";
import PitchSection from "@/app/ui/bim/pitchSection";
import ProjectsGallerySection from "@/app/ui/bim/projectsGallerySection";
import WhoWeAreSection from "@/app/ui/bim/whoWeAreSection";

export const metadata: Metadata = {
  title: "BIM | Tecnología en EdifiK",
  description:
    "Descubre cómo la metodología BIM transforma la planificación, diseño y construcción de nuestros proyectos inmobiliarios en EdifiK.",
};

export default function page() {
  return (
    <div>
      <BimHero />

      <BrandsShowcase />

      <PitchSection />

      <ProjectsGallerySection />

      <WhoWeAreSection />
    </div>
  );
}
