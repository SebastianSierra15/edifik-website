import { NearbyService } from "@/lib/definitios";

type PropertyNearbyServicesProps = {
  services: NearbyService[];
};

export default function PropertyNearbyServices({
  services,
}: PropertyNearbyServicesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-primary dark:text-primaryLight mb-4">
        Servicios Cercanos
      </h2>
      <ul className="list-disc ml-5 text-textPrimary dark:text-textPrimary">
        {services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
    </div>
  );
}
