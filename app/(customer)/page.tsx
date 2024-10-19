import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full h-[500px] m-0 p-0 bg-cover bg-center">
      <Image
        src="/images/image1.png"
        alt="Vista aérea del edificio de EdifiK"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <Image
          src="/images/logo.png"
          alt="Logotipo de EdifiK"
          width={400}
          height={150}
          priority
          style={{ width: "auto", height: "auto" }}
        />

        <h1 className="text-white text-center text-xl mt-4">
          Diseñamos Sueños, Construimos Realidades
        </h1>
      </div>
    </div>
  );
}
