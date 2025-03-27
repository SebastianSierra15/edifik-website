import CertificationCard from "./certificationCard";

export default function CertificationSenction() {
  return (
    <section className="relative mx-auto bg-client-backgroundLight px-4 md:px-20 py-8 md:py-12 lg:py-16">
      <div className="max-w-3xl text-center md:mx-auto">
        <h2 className="text-center text-2xl font-semibold text-client-white md:text-4xl">
          Estamos Certificados
        </h2>

        <hr className="mx-auto my-2 w-1/3 border-t border-white" />
      </div>

      <div className="mt-14 flex items-stretch justify-center md:mt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CertificationCard
            title="BIM"
            description="Certificación en metodología BIM, garantizando calidad y precisión."
            imageSrc="/images/BIM-Logo.png"
            bgColor="bg-client-secondaryLight"
          />

          <CertificationCard
            title="Certificación 2"
            description="Certificación en construcción ecológica."
            imageSrc="/images/BIM-Logo.png"
            bgColor="bg-client-accentLight"
          />

          <CertificationCard
            title="Certificación 3"
            description="Reconocimiento por seguridad en la construcción."
            imageSrc="/images/BIM-Logo.png"
            bgColor="bg-client-secondary"
          />
        </div>
      </div>
    </section>
  );
}
