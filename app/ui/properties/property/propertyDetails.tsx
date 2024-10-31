import { Property } from "@/lib/definitios";

type PropertyDetailsProps = {
  property: Property;
};

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="bg-backgroundAlt dark:bg-backgroundDarkAlt p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-primary dark:text-primaryLight mb-4">
        Detalles de la Propiedad
      </h2>
      <ul className="space-y-2 text-textPrimary dark:text-textPrimary">
        <li>
          <strong>Área:</strong> {property.area} m²
        </li>
        <li>
          <strong>Habitaciones:</strong> {property.rooms}
        </li>
        <li>
          <strong>Baños:</strong> {property.bathrooms}
        </li>
        <li>
          <strong>Nivel:</strong> {property.lobbies}
        </li>
        <li>
          <strong>Tipo de Vivienda:</strong> {property.housingType.name}
        </li>
        {property.availabeDate && (
          <li>
            <strong>Fecha Disponible:</strong>{" "}
            {new Date(property.availabeDate).toLocaleDateString()}
          </li>
        )}
      </ul>
    </div>
  );
}
