import TeamMember from "./teamMember";

export default function TeamSection() {
  return (
    <>
      <section id="nuestro-equipo" className="p-5 lg:p-10">
        <div className="mx-auto px-4 text-center sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-semibold text-white lg:text-4xl">
            Fundadores
          </h2>

          <hr className="mx-auto my-2 w-1/4 border-t border-white" />
        </div>

        <div className="mx-auto mt-10 flex h-auto w-auto flex-col items-center justify-center px-6 sm:px-8 md:flex-row md:items-stretch lg:px-10 md:space-x-4">
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

      <hr className="mx-auto my-2 w-5/6 border-t border-white bg-transparent" />

      <section className="p-5 pb-52 sm:pb-44 md:pb-20 lg:p-10">
        <div className="mx-auto px-4 text-center sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-semibold text-white lg:text-4xl">
            Nuestro Equipo
          </h2>

          <hr className="mx-auto my-2 w-1/4 border-t border-white" />
        </div>

        <div className="mx-8 mt-10 flex h-auto w-auto flex-col items-stretch justify-center px-6 sm:px-8 md:flex-row lg:mx-40 lg:px-10 md:space-x-4">
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
    </>
  );
}
