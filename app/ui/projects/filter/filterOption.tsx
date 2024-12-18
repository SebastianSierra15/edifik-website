import { FaChevronDown } from "react-icons/fa";

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
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-4 transition-transform duration-200 transform hover:scale-105 hover:font-semibold"
        onClick={onToggleOpen}
      >
        <div
          className={`flex items-center space-x-2 text-lg font-medium ${
            selectedItems.length
              ? "text-premium-primary dark:text-premium-primaryLight"
              : "text-premium-textPrimary dark:text-premium-textPrimary"
          }`}
        >
          {icon}
          <span>{label}</span>
        </div>

        <FaChevronDown
          className={`transition-transform duration-300 transform ${
            isOpen ? "rotate-180" : ""
          } text-premium-textPrimary dark:text-premium-textPrimary`}
        />
      </div>

      {/* Items section */}
      {isOpen && (
        <div className="pr-4 space-y-1 mb-7">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`relative overflow-hidden px-3 py-2 rounded-full text-xs border border-premium-borderColor dark:border-premium-borderColorHover transition-colors duration-300 ${
                selectedItems.includes(item.id)
                  ? "bg-premium-primary dark:bg-premium-primaryLight text-white"
                  : "bg-transparent hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark"
              }`}
            >
              <span className="relative z-10 text-premium-textPrimary dark:text-premium-textPrimary">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
