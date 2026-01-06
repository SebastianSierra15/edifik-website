import { House, Map } from "lucide-react";

interface MapToggleButtonProps {
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MapToggleButton({ showMap, setShowMap }: MapToggleButtonProps) {
  const handleClick = () => {
    setShowMap((prev) => !prev);
  };

  return (
    showMap && (
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full border bg-client-background px-4 py-3 text-sm shadow-lg transition-colors border-client-accent text-client-text hover:bg-client-backgroundLight"
        onClick={handleClick}
      >
        <span className="text-client-text">
          {showMap ? "Propiedades" : "Mapa"}
        </span>
        {showMap ? (
          <House size={18} className="text-client-text" />
        ) : (
          <Map size={18} className="text-client-text" />
        )}
      </button>
    )
  );
}
