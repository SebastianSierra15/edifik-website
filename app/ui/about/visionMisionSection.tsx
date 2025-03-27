import VisionMisionCard from "./visionMisionCard";

export default function VisionMisionSection() {
  return (
    <section
      id="mision-vision"
      className="px-4 py-8 md:p-10 -translate-y-10 bg-client-backgroundLight"
    >
      <div className="bg-transparent mx-auto pt-44 md:pt-16 lg:pt-8 py-12">
        <div className="max-w-3xl text-center md:mx-auto md:pt-10">
          <h2 className="text-2xl font-semibold text-client-text md:text-4xl">
            Nuestra Visión y Misión
          </h2>

          <hr className="mx-auto my-2 w-1/3 border-t border-white" />
        </div>

        <div className="mt-14 flex items-stretch justify-center md:mt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <VisionMisionCard
              title="Visión"
              description="Convertirse en el referente líder en soluciones integrales de arquitectura..."
              imageSrc="/images/house2.png"
              bgColor="bg-client-secondaryLight"
            />

            <VisionMisionCard
              title="Misión"
              description="Ofrecer servicios de arquitectura, modelado 3D..."
              imageSrc="/images/house1.png"
              bgColor="bg-client-accentLight"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
