import { Property } from "@/lib/definitios";

type PropertyHeaderProps = {
  property: Property;
};

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-primary dark:text-primaryLight">
        {property.name}
      </h1>
      <p className="text-lg text-textSecondary dark:text-textSecondary">
        {property.address}, {property.city.name}
      </p>
      <p className="text-2xl font-bold text-primary dark:text-primaryLight my-2">
        ${property.price.toLocaleString()}
      </p>
      <p className="text-sm text-textPlaceholder dark:text-textPlaceholder">
        {property.category.name} - {property.propertyType.name}
      </p>
    </div>
  );
}
