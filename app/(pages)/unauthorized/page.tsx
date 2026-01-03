import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-24 w-24 text-client-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9h4.5M12 15.25v.25m-4.25 2h8.5a2 2 0 002-2v-8.5a2 2 0 00-2-2h-8.5a2 2 0 00-2 2v8.5a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-client-accent">Acceso Denegado</h1>

      <p className="mt-4 text-center text-client-text">
        Lo sentimos, no tienes permiso para acceder a esta página.
        <br />
        Por favor, verifica tu cuenta o contacta al administrador.
      </p>

      <div className="mt-6 flex space-x-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-client-accent text-white font-semibold shadow-lg hover:bg-client-accentDark transition-colors"
        >
          Ir a Inicio
        </Link>
      </div>
    </div>
  );
}
