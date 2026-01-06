import { BRAND } from "@/src/config";
import { SocialResponsibility } from "./SocialResponsibility";

export function SocialSection() {
  return (
    <div className="-translate-y-10 bg-client-background pt-12 space-y-4">
      <SocialResponsibility
        title="Diseño con propósito"
        description={`En ${BRAND.name} creemos que la arquitectura debe servir a las personas, al entorno y al futuro, generando impacto positivo en cada proyecto.`}
        points={[
          {
            title: "Arquitectura con sentido social",
            description:
              "Diseñamos espacios accesibles y funcionales que mejoran la calidad de vida.",
          },
          {
            title: "Construcción sostenible",
            description:
              "Aplicamos BIM, diseño bioclimático y materiales ecoeficientes para reducir el impacto ambiental.",
          },
          {
            title: "Impulso a la economía local",
            description:
              "Generamos empleo digno y apoyamos proveedores y mano de obra regional.",
          },
        ]}
        imageSrc="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/about/ResponsabilidadSocial1.webp"
        imagePosition="right"
      />

      <hr className="mx-auto mt-2 mb-6 w-5/6 border-t border-white bg-transparent" />

      <SocialResponsibility
        title="Compromiso con la comunidad"
        description="Construimos con propósito: cada espacio es una oportunidad para transformar vidas, comunidades y entornos sostenibles."
        points={[
          {
            title: "Diseño para el bienestar",
            description:
              "Creamos espacios emocionalmente conectados, usando principios de neuroarquitectura.",
          },
          {
            title: "Innovación responsable",
            description:
              "Integramos tecnologías modernas sin perder el enfoque humano y social del diseño.",
          },
          {
            title: "Educación y conciencia social",
            description:
              "Promovemos la formación en sostenibilidad entre nuestros equipos y comunidades.",
          },
        ]}
        imageSrc="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/about/ResponsabilidadSocial2.webp"
        imagePosition="left"
      />
    </div>
  );
}
