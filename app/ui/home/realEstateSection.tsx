"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useHomeProjects } from "@/app/hooks/projects/home/useHomeProjects";
import RealEstateSectionSkeleton from "../skeletons/realEstateSection";

const RealEstateCards = dynamic(() => import("@/app/ui/home/realEstateCards"), {
  loading: () => <RealEstateSectionSkeleton />,
  ssr: false,
});

export default function RealEstateSection() {
  const { projects, isLoading } = useHomeProjects(4, true);

  return (
    <section className="w-full px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-client-text text-3xl font-semibold">
            Inmobiliaria
          </h2>

          <Link href="/inmobiliaria">
            <button className="bg-transparent border border-client-text text-client-text px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-white hover:text-black transition whitespace-nowrap">
              Ver más →
            </button>
          </Link>
        </div>

        {isLoading ? (
          <RealEstateSectionSkeleton />
        ) : (
          <RealEstateCards projects={projects} />
        )}
      </div>
    </section>
  );
}
