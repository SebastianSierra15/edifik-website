"use client";

import Image from "next/image";

const brands = [
  { name: "Revit", logo: "/images/bim/revitLogo.webp" },
  { name: "V-Ray", logo: "/images/bim/vrayLogo.webp" },
  { name: "Lumion", logo: "/images/bim/lumionLogo.webp" },
  { name: "Autocad", logo: "/images/bim/autocadLogo.webp" },
  { name: "D5 Render", logo: "/images/bim/renderLogo.webp" },
];

export default function BrandsShowcase() {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto flex justify-between px-4">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex items-center justify-center flex-1 text-client-primary gap-2"
          >
            <Image
              title={brand.name}
              src={brand.logo}
              alt={brand.name}
              width={32}
              height={32}
            />

            <span className="hidden sm:inline font-semibold text-sm whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
