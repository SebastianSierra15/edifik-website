"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useGetProperties } from "@/app/hooks/realEstate/useGetProperties";
import HeroSearch from "@/app/ui/realEstate/heroSection/heroSearch";
import FilterMapControls from "@/app/ui/realEstate/filter/filterMapControls";

const MapToggleButton = dynamic(
  () => import("@/app/ui/realEstate/filter/mapToggleButton"),
  { ssr: false }
);
const ProjectsContainer = dynamic(
  () => import("@/app/ui/realEstate/projectsContainer"),
  { ssr: false, loading: () => null }
);

export default function ClientRealEstatePage() {
  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, number[]>
  >({
    cities: [],
    propertyTypes: [],
    housingTypes: [],
    commonAreas: [],
    nearbyServices: [],
    bedrooms: [0],
    bathrooms: [0],
    lobbies: [0],
    area: [1],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [areaRange, setAreaRange] = useState({ min: 0, max: 0 });
  const [entriesPerPage] = useState(2);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [projectTypeId, setProjectTypeId] = useState(2);
  const [searchCoords, setSearchCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [highlightCoords, setHighlightCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [clearSearchInputSignal, setClearSearchInputSignal] = useState(false);

  const { projects, totalEntries, fetchMoreProjects, isLoading } =
    useGetProperties({
      entriesPerPage,
      selectedButtons,
      projectTypeId,
      bounds: showMap ? bounds : null,
      showMap,
      searchCoords,
    });

  useEffect(() => {
    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  useEffect(() => {
    if (showMap) {
      setSearchCoords(null);
      setClearSearchInputSignal(true);
      setBounds(null);
    }
  }, [showMap]);

  const handleSelectCoords = (
    coords: { latitude: number; longitude: number } | null
  ) => {
    if (!coords) {
      setSearchCoords(null);
      setHighlightCoords(null);
      return;
    }

    if (showMap) {
      setSearchCoords(null);
      setHighlightCoords(coords);
    } else {
      setSearchCoords(coords);
      setHighlightCoords(coords);
    }
  };

  return (
    <div className="relative">
      <HeroSearch
        projectTypeId={projectTypeId}
        setProjectTypeId={setProjectTypeId}
        setSearchCoords={handleSelectCoords}
        clearSearchInputSignal={clearSearchInputSignal}
      />

      <hr className="w-full border-client-accent" />

      <div
        className={clsx("px-2 sm:px-6 md:px-20 pt-2 pb-14", showMap && "pb-7")}
      >
        <FilterMapControls
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          showMap={showMap}
          setShowMap={setShowMap}
          totalEntries={totalEntries}
        />
      </div>

      <ProjectsContainer
        projects={projects}
        totalEntries={totalEntries}
        isLoading={isLoading}
        fetchMoreProjects={fetchMoreProjects}
        filterOpen={filterOpen}
        showMap={showMap}
        setFilterOpen={setFilterOpen}
        priceRange={priceRange}
        areaRange={areaRange}
        selectedButtons={selectedButtons}
        setSelectedButtons={setSelectedButtons}
        setBounds={setBounds}
        highlightCoords={highlightCoords}
      />

      <MapToggleButton showMap={showMap} setShowMap={setShowMap} />
    </div>
  );
}
