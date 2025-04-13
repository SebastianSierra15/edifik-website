"use client";

import dynamic from "next/dynamic";

export default function AdminFooter() {
  return (
    <footer className="w-full border-t border-premium-borderColor bg-premium-background py-6 text-premium-textSecondary dark:border-premium-borderColorHover dark:bg-premium-secondaryDark dark:text-premium-textPlaceholder">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 text-sm md:flex-row">
        <span className="text-center text-premium-textPrimary md:text-left dark:text-premium-textSecondary">
          &copy; 2025 EdifiK - Administración. Todos los derechos reservados.
        </span>

        {/*
        <Link
          href="/admin/documentacion"
          className="flex items-center space-x-1 text-premium-primaryDark transition-colors duration-300 hover:text-premium-primary dark:text-premium-primaryLight dark:hover:text-premium-primaryDark"
          aria-label="Documentación"
        >
          <BookText className="h-5 w-5" />
          <span className="text-sm font-medium">Documentación</span>
        </Link>*/}
      </div>
    </footer>
  );
}
