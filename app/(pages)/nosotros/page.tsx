import { Metadata } from "next";
import { HeroSection } from "@/src/components/home";
import {
  AboutSection,
  AboutInteractiveSections,
  SocialSection,
  VisionMisionSection,
} from "@/src/components/about";

export const metadata: Metadata = {
  title: "¿Quiénes somos? | EdifiK",
  description:
    "Conoce al equipo detrás de EdifiK y nuestra misión de transformar el mercado inmobiliario en Colombia.",
};

export default function AboutUsPage() {
  return (
    <div className="">
      <HeroSection
        srcImage="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/QuintasLago/QuintasLago6.webp"
        altImage="Vista del interior de un proyecto de EdifiK"
        title="Sobre Nosotros"
        description="Conoce más sobre EdifiK y nuestro compromiso con la calidad y la innovación."
      />

      <div className="flex flex-col flex-grow bg-client-backgroundAlt">
        <div className="mb-12">
          <AboutSection />
        </div>

        <div className="mb-12">
          <AboutInteractiveSections />
        </div>

        {/*
        <TeamSection />
        */}

        <VisionMisionSection />

        <SocialSection />

        {/*
        <CertificationSenction />
        */}
      </div>
    </div>
  );
}
