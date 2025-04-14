"use client";
import ProjectImageCard from "./projectImageCard";

const projects = [
  {
    name: "Proyecto BIM 1",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153366/92c8932a-cb74-428b-bbcb-acef6fa74963.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153166/45f80c30-e810-4e95-9343-ee092601ff01.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917154036/faf32af0-d416-48fd-a0b5-6d6fcaf43d19.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153937/02e8aaaf-5a15-421d-833c-8a076016d1db.webp",
    ],
  },
  {
    name: "Proyecto BIM 2",
    images: [
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153366/92c8932a-cb74-428b-bbcb-acef6fa74963.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153166/45f80c30-e810-4e95-9343-ee092601ff01.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917154036/faf32af0-d416-48fd-a0b5-6d6fcaf43d19.webp",
      "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Casa/1111/Previsualización/1732917153937/02e8aaaf-5a15-421d-833c-8a076016d1db.webp",
    ],
  },
];

export default function ProjectsGallerySection() {
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
