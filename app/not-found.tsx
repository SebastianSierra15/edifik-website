import { Footer, Header } from "@/src/components/layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <div className="flex flex-col justify-center items-center min-h-screen text-client-text text-center gap-8">
          <h1 className="text-6xl font-bold">¡Ups! Página no encontrada</h1>

          <p className="text-xl text-client-textSecondary">
            Lo sentimos, pero la página que buscas no existe.
          </p>

          <Link
            href="/"
            className="mt-6 px-6 py-3 bg-client-accent text-white font-semibold rounded-full hover:bg-client-accentHover transition-all"
          >
            Regresar al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
