import Image from "next/image";

export default function Home() {
  return (
    <div className="relative m-0 h-[500px] w-full bg-cover bg-center p-0">
      <Image
        src="/images/image1.png"
        alt="Vista aérea del edificio de EdifiK"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <Image
          src="/images/logo.webp"
          alt="Logotipo de EdifiK"
          width={400}
          height={150}
          priority
          style={{ width: "auto", height: "auto" }}
        />

        <h1 className="mt-4 text-center text-xl text-white">
          Diseñamos Sueños, Construimos Realidades
        </h1>
      </div>
    </div>
  );
}
