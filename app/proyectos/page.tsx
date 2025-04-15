import type { Metadata } from "next";
import ClientProjectsPage from "../ui/projects/clientProjectPage";

export const metadata: Metadata = {
  title: "Nuestros Proyectos | EdifiK",
  description:
    "Conoce los proyectos inmobiliarios desarrollados por EdifiK, pensados para transformar espacios con calidad, diseño y visión de futuro.",
};

export default function ProjectPage() {
  return <ClientProjectsPage />;
}
