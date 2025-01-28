import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

interface TeamMemberProps {
  name: string;
  title: string;
  imageSrc: string;
}

const TeamMember = ({ name, title, imageSrc }: TeamMemberProps) => (
  <div className="overflow-hidden bg-white">
    <Image
      className="w-25 object-cover"
      src={imageSrc}
      alt={title}
      width={500}
      height={300}
    />
    <div className="p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900">{name}</h3>
      <p className="text-gray-500">{title}</p>
      <div className="mt-4 flex justify-center space-x-3">
        <Link href="https://www.facebook.com" passHref>
          <FaFacebook className="h-5 w-5 text-gray-500 hover:text-gray-600" />
        </Link>
        <Link href="https://www.x.com" passHref>
          <FaTwitter className="h-5 w-5 text-gray-500 hover:text-gray-600" />
        </Link>
        <Link href="https://www.instagram.com" passHref>
          <FaInstagram className="h-5 w-5 text-gray-500 hover:text-gray-600" />
        </Link>
      </div>
    </div>
  </div>
);

export default function TeamSection() {
  return (
    <div className="bg-white">
      <section className="bg-transparent p-5 lg:p-10">
        <div className="mx-auto px-4 text-center sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-semibold text-blue-600 lg:text-4xl">
            Fundadores
          </h2>
          <hr className="mx-auto my-2 w-1/4 border-t border-gray-400"></hr>
        </div>

        <div className="mx-auto mt-10 flex h-auto w-auto flex-col items-center justify-center px-6 sm:px-8 md:flex-row md:items-stretch lg:px-10">
          <TeamMember
            name="Andrés Trujillo"
            title="Presidente"
            imageSrc="/images/services-11.jpg"
          />
          <TeamMember
            name="Alejandro Torres"
            title="Vice Presidente"
            imageSrc="/images/services-11.jpg"
          />
        </div>
      </section>

      <hr className="mx-auto my-2 w-5/6 border-t border-gray-400 bg-transparent"></hr>

      <section className="bg-transparent p-5 pb-96 md:pb-60 lg:pb-32">
        <div className="mx-auto px-4 text-center sm:px-6 lg:px-10">
          <h3 className="text-center text-xl font-semibold text-blue-600 lg:text-3xl">
            Nuestro Equipo
          </h3>
          <hr className="mx-auto my-2 w-1/4 border-t border-gray-400"></hr>
        </div>

        <div className="mx-8 mt-10 flex h-auto w-auto flex-col items-stretch justify-center px-6 sm:px-8 md:flex-row lg:mx-40 lg:px-10">
          <TeamMember
            name="Andrés Trujillo"
            title="Arquitecto"
            imageSrc="/images/services-11.jpg"
          />
          <TeamMember
            name="Yecid García"
            title="Arquitecto"
            imageSrc="/images/services-11.jpg"
          />
        </div>
      </section>
    </div>
  );
}
