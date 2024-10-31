"use client";

import { useEffect } from "react";
import { orbit } from "ldrs";

export default function Loader() {
  useEffect(() => {
    orbit.register();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
      <l-orbit size="64" speed="1.5" color="#D4AF37"></l-orbit>
    </div>
  );
}
