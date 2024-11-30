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
              ? "text-primary dark:text-primaryLight"
              : "text-textPrimary dark:text-textPrimary"
          }`}
        >
          {icon}
          <span>{label}</span>
        </div>

        <FaChevronDown
          className={`transition-transform duration-300 transform ${
            isOpen ? "rotate-180" : ""
          } text-textPrimary dark:text-textPrimary`}
        />
      </div>

      {/* Items section */}
      {isOpen && (
        <div className="pr-4 space-y-1 mb-7">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`relative overflow-hidden px-3 py-2 rounded-full text-xs border border-borderColor dark:border-borderColorHover transition-colors duration-300 ${
                selectedItems.includes(item.id)
                  ? "bg-primary dark:bg-primaryLight text-white"
                  : "bg-transparent hover:bg-backgroundLight dark:hover:bg-backgroundDark"
              }`}
            >
              <span className="relative z-10 text-textPrimary dark:text-textPrimary">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
