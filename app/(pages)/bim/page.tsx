import Head from "next/head";
import BimHero from "@/app/ui/bim/bimHero";
import BrandsShowcase from "@/app/ui/bim/brandsShowcase";
import PitchSection from "@/app/ui/bim/pitchSection";
import ProjectsGallerySection from "@/app/ui/bim/projectsGallerySection";
import WhoWeAreSection from "@/app/ui/bim/whoWeAreSection";

export default function page() {
  return (
    <>
      <Head>
        <title>BIM | Tecnología Inmobiliaria en EdifiK</title>
        <meta
          name="description"
          content="Conoce cómo EdifiK aplica BIM para mejorar la planificación, diseño y ejecución de proyectos inmobiliarios."
        />
      </Head>

      <div>
        <BimHero />

        <BrandsShowcase />

        <PitchSection />

        <ProjectsGallerySection />

        <WhoWeAreSection />
      </div>
    </>
  );
}
