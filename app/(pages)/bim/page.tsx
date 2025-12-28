import { Metadata } from "next";
import {
  BimHero,
  BrandsShowcase,
  PitchSection,
  ProjectsGallerySection,
  WhoWeAreSection,
} from "@/src/components/bim";

export const metadata: Metadata = {
  title: "BIM | Tecnología en EdifiK",
  description:
    "Descubre cómo la metodología BIM transforma la planificación, diseño y construcción de nuestros proyectos inmobiliarios en EdifiK.",
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
