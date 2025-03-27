import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Inicio">
      <div className="bg-client-background px-6 py-2 rounded-full h-12 flex items-center justify-center">
        <Image
          src="/images/logo.webp"
          alt="Logo de EdifiK"
          width={90}
          height={36}
          className="lg:w-auto h-auto object-contain"
        />
      </div>
    </Link>
  );
}
