import dynamic from "next/dynamic";
import clsx from "clsx";

const ChevronDown = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronDown)
);

type FilterOptionProps = {
  label: string;
  icon: React.ReactNode;
  items: { id: number; name: string }[];
  selectedItems: number[];
  onToggleItem: (id: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
};

export default function FilterOption({
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
        className="mb-4 flex transform cursor-pointer items-center justify-between transition-transform duration-200 hover:scale-105 hover:font-semibold"
        onClick={onToggleOpen}
        onKeyDown={(e) => e.key === "Enter" && onToggleOpen()}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 text-lg font-medium",
            selectedItems.length
              ? "text-premium-primary dark:text-premium-primaryLight"
              : "text-premium-textPrimary dark:text-premium-textPrimary"
          )}
        >
          {icon}
          <span>{label}</span>
        </div>

        <ChevronDown
          className={clsx(
            "transform transition-transform duration-300",
            isOpen && "rotate-180",
            "text-premium-textPrimary dark:text-premium-textPrimary"
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
                "border-premium-borderColor dark:border-premium-borderColorHover",
                selectedItems.includes(item.id)
                  ? "bg-premium-primary text-white dark:bg-premium-primaryLight"
                  : "bg-transparent hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark"
              )}
            >
              <span className="relative z-10 text-premium-textPrimary dark:text-premium-textPrimary">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
