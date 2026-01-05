import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { ClientProjectsPage } from "@/src/components/projects";

export const metadata: Metadata = {
  title: `Nuestros Proyectos`,
  description: `Conoce los proyectos inmobiliarios desarrollados por ${BRAND.name}, pensados para transformar espacios con calidad, diseño y visión de futuro.`,
};

export default function ProjectPage() {
  return <ClientProjectsPage />;
}
