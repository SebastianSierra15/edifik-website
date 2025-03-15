import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/app/ui/login/registerForm";
import AuthProviders from "@/app/ui/login/authProviders";

export default function RegisterPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
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
        <div className="w-full sm:w-1/2 flex flex-col justify-start py-10 sm:py-0 px-6 sm:px-10 lg:px-16 space-y-8 lg:space-y-4 bg-client-background sm:bg-transparent sm:relative z-10 sm:z-0 bg-opacity-10 sm:bg-opacity-100 rounded-lg sm:rounded-none m-4 sm:m-0 max-h-screen overflow-y-auto">
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            width={90}
            height={36}
            priority
            className="mt-10 sm:mt-0 w-32 h-14 object-contain"
          />

          <h1 className="text-3xl font-bold text-client-text mb-2">
            Crea tu cuenta
          </h1>

          <p className="text-client-textSecondary mb-2">
            Únete y comienza a explorar nuevas oportunidades.
          </p>

          <div className="space-y-2">
            <RegisterForm />
            <AuthProviders />
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-client-textSecondary">¿Ya tienes una cuenta?</p>
            <Link
              href="/login"
              className="ml-2 text-client-text transition hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>

        <div className="hidden sm:block sm:w-1/2 h-screen fixed right-0 top-0">
          <Image
            src="/images/login/login.webp"
            alt="Registro"
            fill
            objectFit="cover"
            className="rounded-r-xl"
          />
        </div>
      </div>
    </div>
  );
}
