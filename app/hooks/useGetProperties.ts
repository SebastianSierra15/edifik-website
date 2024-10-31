"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PropertySummary } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

interface UsePropertiesOptions {
  entriesPerPage: number;
  selectedCategory: string;
  selectedButtons: Record<string, number[]>;
  currentProperties: PropertySummary[];
}

export function useGetProperties({
  entriesPerPage,
  selectedCategory,
  selectedButtons,
  currentProperties,
}: UsePropertiesOptions) {
  const [properties, setProperties] =
    useState<PropertySummary[]>(currentProperties);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProperties();
  }, 300);

  const resetProperties = () => {
    setProperties([]);
    setCurrentPage(1);
  };

  const fetchProperties = async (isLoadMore = false, page = 1) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const params = {
        page,
        pageSize: entriesPerPage,
        searchTerm,
        categories: selectedCategory,
        ...Object.fromEntries(
          Object.entries(selectedButtons).map(([key, value]) => [
            key,
            value.join(","),
          ])
        ),
      };

      const response = await axios.get("/api/properties", { params });
      const newProperties: PropertySummary[] = response.data.properties;

      setProperties((prev) =>
        isLoadMore
          ? [
              ...prev,
              ...newProperties.filter(
                (p) => !prev.some((prop) => prop.id === p.id)
              ),
            ]
          : newProperties
      );

      setTotalEntries(response.data.totalEntries);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm, selectedCategory, selectedButtons]);

  const fetchMoreProperties = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProperties(true, nextPage);
  };

  return {
    properties,
    totalEntries,
    fetchMoreProperties,
    debouncedSearch,
    resetProperties,
    isLoading,
  };
}
