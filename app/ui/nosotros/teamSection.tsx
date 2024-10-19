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
      className="object-cover w-25"
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
          <FaFacebook className="text-gray-500 hover:text-gray-600 h-5 w-5" />
        </Link>
        <Link href="https://www.x.com" passHref>
          <FaTwitter className="text-gray-500 hover:text-gray-600 h-5 w-5" />
        </Link>
        <Link href="https://www.instagram.com" passHref>
          <FaInstagram className="text-gray-500 hover:text-gray-600 h-5 w-5" />
        </Link>
      </div>
    </div>
  </div>
);

export default function TeamSection() {
  return (
    <div className="bg-white">
      <section className="bg-transparent p-5 lg:p-10">
        <div className="mx-auto text-center px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-semibold text-blue-600 text-center lg:text-4xl">
            Fundadores
          </h2>
          <hr className="my-2 mx-auto w-1/4 border-t border-gray-400"></hr>
        </div>

        <div className="mx-auto mt-10 flex flex-col h-auto w-auto items-center md:items-stretch justify-center px-6 sm:px-8 lg:px-10 md:flex-row">
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

      <hr className="my-2 mx-auto w-5/6 border-t border-gray-400 bg-transparent"></hr>

      <section className="bg-transparent p-5 pb-96 md:pb-60 lg:pb-32">
        <div className="mx-auto text-center px-4 sm:px-6 lg:px-10">
          <h3 className="text-xl font-semibold text-blue-600 text-center lg:text-3xl">
            Nuestro Equipo
          </h3>
          <hr className="my-2 mx-auto w-1/4 border-t border-gray-400"></hr>
        </div>

        <div className="mx-8 mt-10 flex flex-col h-auto w-auto items-stretch justify-center px-6 sm:px-8 lg:mx-40 lg:px-10 md:flex-row">
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
