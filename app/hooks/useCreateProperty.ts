import { useState } from "react";

export function useCreateProperty() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProperty = async (propertyData: any): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al crear la propiedad.");
      }

      const data = await response.json();
      return data.propertyId;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProperty, loading, error };
}
