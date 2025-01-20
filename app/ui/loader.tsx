"use client";

import { useEffect } from "react";
import { orbit } from "ldrs";

type LoaderProps = {
  message: string;
};

export default function Loader({ message }: LoaderProps) {
  useEffect(() => {
    orbit.register();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <l-orbit size="64" speed="1.5" color="#D4AF37" />
      <p className="mt-4 animate-gradient bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-[length:200%_auto] bg-clip-text text-lg font-semibold text-transparent">
        {message}
      </p>
    </div>
  );
}
