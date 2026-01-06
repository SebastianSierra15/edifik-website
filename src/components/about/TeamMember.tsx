import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
} from "@/src/components/shared/icons";

interface TeamMemberProps {
  name: string;
  title: string;
  imageSrc: string;
}

export function TeamMember({ name, title, imageSrc }: TeamMemberProps) {
  return (
    <div className="overflow-hidden w-full shadow-lg">
      <Image
        className="w-full rounded-lg object-cover"
        src={imageSrc}
        alt={title}
        width={500}
        height={300}
      />

      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-white">{name}</h3>

        <p className="text-client-textPlaceholder">{title}</p>

        <div className="mt-4 flex justify-center space-x-3">
          <Link href="https://www.facebook.com" passHref>
            <FacebookIcon className="h-5 w-5 text-gray-500 hover:text-gray-600" />
          </Link>

          <Link href="https://www.x.com" passHref>
            <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-600" />
          </Link>

          <Link href="https://www.instagram.com" passHref>
            <InstagramIcon className="h-5 w-5 text-gray-500 hover:text-gray-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
