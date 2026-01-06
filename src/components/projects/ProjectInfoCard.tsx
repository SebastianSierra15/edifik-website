import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectInfoCardProps {
  id: number;
  name: string;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
}

export function ProjectInfoCard({
  id,
  name,
  location,
  area,
  bedrooms,
  bathrooms,
}: ProjectInfoCardProps) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[360px] w-[calc(100%-1.5rem)] rounded-xl bg-zinc-800 text-white px-4 py-3 flex flex-col gap-1 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
        </div>

        <Link
          href={`/proyectos/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FBE6C2] w-9 h-9 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
        >
          <ArrowUpRight className="text-black w-4 h-4" />
        </Link>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-gray-300">
        <p className="text-sm text-gray-300">{location}</p>

        <div className="flex items-center divide-x divide-gray-600 text-xs text-gray-300">
          {typeof area === "number" && area > 0 && (
            <p className="pr-2">{area}m²</p>
          )}
          {typeof bedrooms === "number" && bedrooms > 0 && (
            <p className="pl-2 pr-2">{bedrooms} Hab.</p>
          )}
          {typeof bathrooms === "number" && bathrooms > 0 && (
            <p className="pl-2">{bathrooms} Baños.</p>
          )}
        </div>
      </div>
    </div>
  );
}
