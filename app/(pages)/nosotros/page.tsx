import Image from "next/image";
import Timeline from "../../ui/nosotros/timeline";
import TeamSection from "../../ui/nosotros/teamSection";
import StatsSection from "../../ui/nosotros/statsSection";
import VisionMisionSection from "../../ui/nosotros/visionMisionSection";
import SocialResponsibilitySection from "../../ui/nosotros/socialResponsibilitySection";
import CertificationCard from "../../ui/nosotros/certificationCard";

export default function AboutUsPage() {
  return (
    <main>
      {/* Banner Section */}
      <div className="relative h-[500px] w-full bg-cover bg-center">
        <Image
          src="/images/image1.png"
          alt="Imagen de nosotros"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-center text-5xl text-white lg:text-7xl">
            Nosotros
          </h1>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-5 lg:p-20">
        <div className="mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="mx-8 py-5 text-center lg:text-left">
            <h1 className="mb-10 text-3xl font-bold text-blue-600 lg:text-5xl">
              Te damos la bienvenida a EdifiK
            </h1>
            <h2 className="mb-10 text-2xl font-semibold text-blue-600 lg:text-4xl">
              ¿Quiénes Somos?
            </h2>
            <p className="text-justify text-sm text-gray-700 lg:text-base">
              Somos EdifiK, tu socio ideal en diseño y desarrollo de proyectos
              arquitectónicos. Especializados en metodología BIM, nos dedicamos
              a crear y planificar cada etapa de tu proyecto con precisión y
              eficiencia. Desde el modelado y renderizado hasta la planificación
              detallada, garantizamos soluciones innovadoras que transforman tus
              ideas en realidades tangibles. Con EdifiK, cada proyecto es una
              oportunidad para plasmar tus ideas y volverlas realidad.
            </p>
          </div>

          <div className="mx-auto grid grid-cols-1 justify-center gap-5 text-center">
            <Image
              className="self-center object-cover"
              src="/images/services-11.jpg"
              alt="Arquitecto trabajando en un proyecto"
              width={400}
              height={300}
              priority
            />
          </div>
        </div>
      </div>

      {/* Timeline, Team, and Stats Section */}
      <Timeline />
      <TeamSection />
      <StatsSection />

      {/* Vision and Mission Section */}
      <div className="bg-gray-200 px-0 pt-44 sm:px-10 md:pt-16 lg:px-32 lg:pt-8">
        <section className="relative p-5">
          <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
            <div className="max-w-3xl text-center md:mx-auto">
              <h2 className="text-2xl font-semibold text-blue-600 md:text-4xl">
                Nuestra Visión y Misión
              </h2>
              <hr className="mx-auto my-2 w-1/4 border-t border-gray-400" />
            </div>

            <div className="mt-14 flex items-stretch justify-center md:mt-20">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <VisionMisionSection
                  title="Visión"
                  description="Convertirse en el referente líder en soluciones integrales de arquitectura..."
                  imageSrc="/images/house2.png"
                  bgColor="bg-blue-200"
                  textColor="text-blue-700"
                />
                <VisionMisionSection
                  title="Misión"
                  description="Ofrecer servicios de arquitectura, modelado 3D..."
                  imageSrc="/images/house1.png"
                  bgColor="bg-yellow-100"
                  textColor="text-blue-700"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Social Responsibility Section */}
      <div className="bg-white">
        <SocialResponsibilitySection
          title="Responsabilidad Social"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, est?"
          points={[
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
          ]}
          imageSrc="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80&h=768"
          imagePosition="right"
        />

        <hr className="mx-auto my-2 w-5/6 border-t border-gray-400 bg-transparent"></hr>

        <SocialResponsibilitySection
          title="Responsabilidad Social"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, est?"
          points={[
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
            {
              title: "Lorem, ipsum dolor.",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            },
          ]}
          imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80&h=768"
          imagePosition="left"
        />
      </div>

      {/* Certifications Section */}
      <div className="bg-gray-200 px-10 md:px-20">
        <section className="relative px-5">
          <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:py-16">
            <div className="max-w-3xl text-center md:mx-auto">
              <h2 className="text-center text-2xl font-semibold text-blue-600 md:text-4xl">
                Estamos Certificados
              </h2>
              <hr className="mx-auto my-2 w-1/4 border-t border-gray-400"></hr>
            </div>

            <div className="mt-14 flex items-stretch justify-center md:mt-20">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CertificationCard
                  title="BIM"
                  description="Certificación en metodología BIM, garantizando calidad y precisión."
                  imageSrc="/images/BIM-Logo.png"
                  bgColor="bg-blue-200"
                />
                <CertificationCard
                  title="Certificación 2"
                  description="Certificación en construcción ecológica."
                  imageSrc="/images/BIM-Logo.png"
                  bgColor="bg-orange-200"
                />
                <CertificationCard
                  title="Certificación 3"
                  description="Reconocimiento por seguridad en la construcción."
                  imageSrc="/images/BIM-Logo.png"
                  bgColor="bg-pink-50"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
