import Image from "next/image";

interface HeroSectionProps {
  srcImage: string;
  altImage: string;
  title: string;
  description: string;
  objectPosition?: "top" | "center" | "bottom";
}

export default function HeroSection({
  srcImage,
  altImage,
  title,
  description,
  objectPosition = "center",
}: HeroSectionProps) {
  const objectClass =
    objectPosition === "top"
      ? "object-top"
      : objectPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  return (
    <section className="w-full">
      <div className="relative w-full h-96">
        <Image
          src={srcImage}
          alt={altImage}
          fill
          className={`object-cover ${objectClass}`}
          priority
        />
      </div>

      <div className="text-white pt-8 px-6 text-center">
        <h1 className="text-3xl w-full sm:w-3/5 md:w-2/3 lg:w-3/5 mx-auto md:text-5xl font-bold whitespace-pre-line">
          {title}
        </h1>

        <p className="mt-4 w-full sm:w-3/5 md:w-2/3 lg:w-1/3 mx-auto text-sm md:text-lg text-client-textPlaceholder whitespace-pre-line">
          {description}
        </p>
      </div>
    </section>
  );
}
