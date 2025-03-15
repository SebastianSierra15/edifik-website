import HeroSection from "@/app/ui/home/heroSection";
import ContactSection from "../../ui/contact/contactSection";
import ContactDetailsSection from "@/app/ui/contact/contactDetailsSection";

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

      <hr className="mx-auto my-2 w-5/6 border-t border-white" />

      <ContactDetailsSection />

      <hr className="mx-auto my-2 w-5/6 border-t border-white" />

      <div className="py-10">
        <div id="map" className="h-96 w-full" />{" "}
      </div>
    </>
  );
}
