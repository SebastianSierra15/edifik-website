import { CommonArea } from "@/lib/definitios";

type PropertyCommonAreasProps = {
  areas: CommonArea[];
};

export default function PropertyCommonAreas({
  areas,
}: PropertyCommonAreasProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-primary dark:text-primaryLight mb-4">
        Áreas Comunes
      </h2>
      <ul className="list-disc ml-5 text-textPrimary dark:text-textPrimary">
        {areas.map((area) => (
          <li key={area.id}>{area.name}</li>
        ))}
      </ul>
    </div>
  );
}
