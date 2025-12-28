import { ProjectImageCard } from "./ProjectImageCard";

const projects = [
  {
    name: "Quintas del Lago",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/QuintasLago/QuintasLago1.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/QuintasLago/QuintasLago2.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/QuintasLago/QuintasLago3.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/QuintasLago/QuintasLago4.webp",
    ],
  },
  {
    name: "Bella Vista",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/BellaVista/BellaVista1.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/BellaVista/BellaVista2.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/BellaVista/BellaVista3.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/BellaVista/BellaVista4.webp",
    ],
  },
  {
    name: "Casa Quinta del Mar",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/CasaQuintaMar/QuintasMar1.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/CasaQuintaMar/QuintasMar2.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/CasaQuintaMar/QuintasMar3.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/CasaQuintaMar/QuintasMar4.webp",
    ],
  },
  {
    name: "Edificio San Carlos",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia1.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia2.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia3.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia4.webp",
    ],
  },
];

export function ProjectsGallerySection() {
  return (
    <section className="w-full py-10 bg-client-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl text-center sm:text-5xl font-bold mb-6 sm:mb-10">
          <span className="text-black">Nuestros </span>
          <span className="italic text-[#8c4c2f]">Proyectos</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
          {projects.map((project, index) => (
            <ProjectImageCard
              key={index}
              name={project.name}
              images={project.images}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
