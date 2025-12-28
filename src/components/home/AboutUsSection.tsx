import { AnimatedStats } from "./AnimatedStats";

const stats = [
  { label: "Años en el mercado", value: 2 },
  { label: "Proyectos realizados", value: 22 },
  { label: "Proyectos en desarrollo", value: 3 },
];

export function AboutUsSection() {
  return (
    <section className="w-full text-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-3 w-3 bg-gray-500 rounded-full"></span>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Acerca de Nosotros
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-client-textPlaceholder leading-tight">
            TENEMOS LA{" "}
            <span className="font-semibold text-white">EXPERIENCIA</span> Y EL{" "}
            <span className="font-semibold text-white">CONOCIMIENTO</span> PARA
            DISEÑAR TU ESPACIO, SOMOS{" "}
            <span className="font-semibold text-white">EDIFIK.</span>
          </h2>
        </div>

        <div className="flex justify-center mx-auto">
          <AnimatedStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
