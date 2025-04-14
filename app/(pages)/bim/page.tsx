import BimHero from "@/app/ui/bim/bimHero";
import BrandsShowcase from "@/app/ui/bim/brandsShowcase";
import PitchSection from "@/app/ui/bim/pitchSection";
import ProjectsGallerySection from "@/app/ui/bim/projectsGallerySection";
import WhoWeAreSection from "@/app/ui/bim/whoWeAreSection";

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
