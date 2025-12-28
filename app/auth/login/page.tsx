import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/src/components/auth/Logo";
import { LoginForm, AuthProviders } from "@/src/components/auth";

export const metadata: Metadata = {
  title: "Iniciar Sesión | EdifiK",
  description:
    "Accede a tu cuenta para gestionar tus propiedades, proyectos y membresías en la plataforma inmobiliaria EdifiK.",
};

export default function LoginPage() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 w-full h-screen sm:hidden">
        <Image
          src="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia4.webp"
          alt="Edificio moderno"
          fill
          objectFit="cover"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="relative flex sm:flex-row sm:items-center">
        <div className="w-full overflow-y-scroll sm:overflow-hidden sm:w-1/2 flex flex-col justify-center py-10 sm:py-0 px-6 sm:px-10 lg:px-16 space-y-8 lg:space-y-4 bg-client-background sm:bg-transparent sm:relative z-10 sm:z-0 rounded-lg sm:rounded-none m-4 sm:m-0 sm:min-h-screen">
          <div className="-translate-x-6">
            <Logo />
          </div>

          <h1 className="text-3xl font-bold text-client-text mb-2">
            Bienvenido a Edifik
          </h1>

          <p className="text-client-textSecondary">
            Accede a tu cuenta y descubre soluciones innovadoras para tu próximo
            proyecto.
          </p>

          <div className="space-y-2">
            <LoginForm />
            <AuthProviders />
          </div>

          <div className="flex flex-row justify-center items-center">
            <p className="text-client-textSecondary">¿No tienes una cuenta?</p>

            <Link
              href="/auth/register"
              className="ml-2 text-client-text transition hover:underline"
            >
              Registrate
            </Link>
          </div>
        </div>

        <div className="w-1/2 h-screen relative hidden sm:block">
          <Image
            src="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia4.webp"
            alt="Edificio moderno"
            fill
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}
