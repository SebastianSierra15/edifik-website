import Head from "next/head";
import HeroSection from "@/app/ui/home/heroSection";
import AboutSection from "@/app/ui/about/aboutSection";
import Timeline from "../../ui/about/timeline";
import TeamSection from "../../ui/about/teamSection";
import StatsSection from "../../ui/about/statsSection";
import VisionMisionSection from "@/app/ui/about/visionMisionSection";
import SocialSection from "@/app/ui/about/socialSection";
import CertificationSenction from "@/app/ui/about/certificationSection";

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>¿Quiénes somos? | EdifiK</title>
        <meta
          name="description"
          content="Somos EdifiK, una plataforma digital para la promoción y gestión de proyectos inmobiliarios en Colombia."
        />
      </Head>

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
