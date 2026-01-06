import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface FilterOptionProps {
  label: string;
  icon: React.ReactNode;
  items: { id: number; name: string }[];
  selectedItems: number[];
  onToggleItem: (id: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function FilterOption({
  label,
  icon,
  items,
  selectedItems,
  onToggleItem,
  isOpen,
  onToggleOpen,
}: FilterOptionProps) {
  return (
    <>
      <div
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        className="mb-4 flex transform cursor-pointer items-center justify-between transition-transform duration-200 hover:scale-105 hover:font-semibold text-white"
        onClick={onToggleOpen}
        onKeyDown={(e) => e.key === "Enter" && onToggleOpen()}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 text-lg font-medium",
            selectedItems.length && "text-client-accent"
          )}
        >
          {icon}
          <span>{label}</span>
        </div>

        <ChevronDown
          className={clsx(
            "transform transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="mb-7 space-y-1 pr-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={clsx(
                "relative overflow-hidden rounded-full border px-3 py-2 text-xs transition-colors duration-300",
                "border-client-accent",
                selectedItems.includes(item.id)
                  ? "bg-client-accent text-white"
                  : "bg-transparent"
              )}
            >
              <span className="relative z-10 ">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
