import HeroSection from "@/app/ui/home/heroSection";
import ContactSection from "../../ui/contact/contactSection";
import ContactDetailsSection from "@/app/ui/contact/contactDetailsSection";
import Map from "@/app/ui/realEstate/project/map";

export default function ContactPage() {
  return (
    <>
      <HeroSection
        srcImage="/images/home/home.webp"
        altImage="Vista del interior de un proyecto de EdifiK"
        title="Contáctanos"
        description="Estamos aquí para ayudarte con tus proyectos de construcción y diseño."
      />

      <ContactSection />

      <hr className="mx-auto w-5/6 border-t border-white" />

      <ContactDetailsSection />

      <hr className="mx-auto w-5/6 border-t border-white" />

      <div className="px-4 sm:px-6 lg:px-12 pb-12 w-full">
        <div className="w-full h-96 overflow-hidden rounded-lg border border-white">
          <Map coordinates={{ lat: 4.5709, lng: -74.2973 }} />
        </div>
      </div>
    </>
  );
}
