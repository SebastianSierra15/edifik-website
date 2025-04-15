import { Metadata } from "next";
import HeroSection from "@/app/ui/home/heroSection";
import AboutSection from "@/app/ui/about/aboutSection";
import Timeline from "../ui/about/timeline";
import TeamSection from "../ui/about/teamSection";
import StatsSection from "../ui/about/statsSection";
import VisionMisionSection from "@/app/ui/about/visionMisionSection";
import SocialSection from "@/app/ui/about/socialSection";
import CertificationSenction from "@/app/ui/about/certificationSection";

export const metadata: Metadata = {
  title: "¿Quiénes somos? | EdifiK",
  description:
    "Conoce al equipo detrás de EdifiK y nuestra misión de transformar el mercado inmobiliario en Colombia.",
};

export default function AboutUsPage() {
  return (
    <>
      <HeroSection
        srcImage="/images/home/home.webp"
        altImage="Vista del interior de un proyecto de EdifiK"
        title="Sobre Nosotros"
        description="Conoce más sobre EdifiK y nuestro compromiso con la calidad y la innovación."
      />

      <AboutSection />

      <Timeline />

      <TeamSection />

      <StatsSection />

      <VisionMisionSection />

      <SocialSection />

      <CertificationSenction />
    </>
  );
}
