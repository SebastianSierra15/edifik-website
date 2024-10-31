"use client";

import { Property } from "@/lib/definitios";
import PropertyHeader from "@/app/ui/properties/property/propertyHeader";
import PropertyDetails from "@/app/ui/properties/property/propertyDetails";
import PropertyGallery from "@/app/ui/properties/property/propertyGalery";
import PropertyNearbyServices from "@/app/ui/properties/property/propertyNearbyServices";
import PropertyCommonAreas from "@/app/ui/properties/property/propertyCommonAreas";
import { usePropertyByName } from "@/app/hooks/usePropertyByName";

export default function PropertyPage({ params }: { params: { name: string } }) {
  const { property, loading, error } = usePropertyByName(params.name);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>Propiedad no encontrada</p>;

  return (
    <div className="container mx-auto p-6 bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimary">
      <PropertyHeader property={property} />
      <PropertyGallery images={property.propertyMedia} />
      <PropertyDetails property={property} />
      <PropertyNearbyServices services={property.nearbyService} />
      <PropertyCommonAreas areas={property.commonAreas} />
    </div>
  );
}
