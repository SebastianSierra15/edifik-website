import Image from "next/image";

interface ProfileCardProps {
  image: string;
  name: string;
  title: string;
  role: string;
  specialty: string;
}

export default function ProfileCard({
  image,
  name,
  title,
  role,
  specialty,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 relative rounded-full overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <p className="font-bold mt-6 text-client-text">{name}</p>
      <p className="text-client-secondary text-sm">{title}</p>
      <p className="text-client-secondary text-sm">{role}</p>
      <p className="text-client-secondary text-sm">{specialty}</p>
    </div>
  );
}
