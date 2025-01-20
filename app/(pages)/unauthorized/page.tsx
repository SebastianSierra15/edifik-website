"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-premium-background px-4 dark:bg-premium-backgroundDark">
      {/* Icon */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-24 w-24 text-premium-primary dark:text-premium-primaryLight"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9h4.5M12 15.25v.25m-4.25 2h8.5a2 2 0 002-2v-8.5a2 2 0 00-2-2h-8.5a2 2 0 00-2 2v8.5a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Acceso Denegado
      </h1>

      {/* Description */}
      <p className="mt-4 text-center text-premium-textSecondary dark:text-premium-textPlaceholder">
        Lo sentimos, no tienes permiso para acceder a esta página.
        <br />
        Por favor, verifica tu cuenta o contacta al administrador.
      </p>

      {/* Actions */}
      <div className="mt-6 flex space-x-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-premium-primary text-white font-semibold shadow-lg hover:bg-premium-primaryDark transition-colors dark:bg-premium-primaryLight dark:hover:bg-premium-primaryDark"
        >
          Ir a Inicio
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-premium-secondary text-white font-semibold shadow-lg hover:bg-premium-secondaryDark transition-colors dark:bg-premium-secondaryLight dark:hover:bg-premium-secondaryDark"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
