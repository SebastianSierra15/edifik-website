import Image from "next/image";
import Link from "next/link";
import LoginForm from "../ui/login/loginForm";
import AuthProviders from "../ui/login/authProviders";

export default function LoginPage() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 w-full h-screen sm:hidden">
        <Image
          src="/images/login/login.webp"
          alt="Edificio moderno"
          fill
          objectFit="cover"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="relative h-full flex sm:flex-row sm:items-center">
        <div className="w-full overflow-y-scroll sm:overflow-hidden sm:w-1/2 flex flex-col justify-center py-10 sm:py-0 px-6 sm:px-10 lg:px-16 space-y-8 lg:space-y-4 bg-client-background sm:bg-transparent sm:relative z-10 sm:z-0 bg-opacity-10 sm:bg-opacity-100 rounded-lg sm:rounded-none m-4 sm:m-0">
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={90}
            height={36}
            priority
            className="mt-10 sm:mt-0 w-32 h-14 object-contain"
          />

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
              href="/login/register"
              className="ml-2 text-client-text transition hover:underline"
            >
              Registrate
            </Link>
          </div>
        </div>

        <div className="w-1/2 h-screen relative hidden sm:block">
          <Image
            src="/images/login/login.webp"
            alt="Edificio moderno"
            fill
            objectFit="cover"
            className="rounded-r-xl"
          />
        </div>
      </div>
    </div>
  );
}
