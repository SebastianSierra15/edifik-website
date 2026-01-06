"use client";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

interface ProjectImageCardProps {
  name: string;
  images: string[];
}

export function ProjectImageCard({
  name,
  images,
}: ProjectImageCardProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md shadow-black">
      <div className="w-full h-full relative">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div className="absolute top-3 left-3 px-4 py-1 rounded-full text-client-text text-sm font-semibold shadow-sm shadow-black border border-white bg-client-secondaryDark opacity-90">
        {name}
      </div>

      <div className="absolute bottom-3 right-3 flex gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={clsx(
              "relative w-14 h-14 rounded shadow-md shadow-black border hover:scale-105 transition",
              selected === index ? "border-white" : "border-white/60"
            )}
          >
            <Image
              src={img}
              alt={`${name} miniatura ${index}`}
              fill
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
