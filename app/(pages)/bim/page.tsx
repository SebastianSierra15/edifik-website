import { Metadata } from "next";
import { BRAND } from "@/src/config";
import {
  BimHero,
  BrandsShowcase,
  PitchSection,
  ProjectsGallerySection,
  WhoWeAreSection,
} from "@/src/components/bim";

export const metadata: Metadata = {
  title: `BIM`,
  description: `Descubre cómo la metodología BIM transforma la planificación, diseño y construcción de nuestros proyectos inmobiliarios en ${BRAND.name}.`,
};

export default function page() {
  return (
    <>
      <BimHero />

      <BrandsShowcase />

      <PitchSection />

      <ProjectsGallerySection />

      <WhoWeAreSection />
    </>
  );
}
