import { FaChevronDown } from "react-icons/fa";

type NumericCounterProps = {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  value: number;
  increment: () => void;
  decrement: () => void;
};

export default function FilterNumericCounter({
  label,
  icon,
  isOpen,
  setIsOpen,
  value,
  increment,
  decrement,
}: NumericCounterProps) {
  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between cursor-pointer transition-transform duration-200 transform hover:scale-105 hover:font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`flex items-center space-x-2 text-lg font-medium ${
            value > 0
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

      {/* Numeric counter section */}
      {isOpen && (
        <div className="flex items-center justify-center space-x-1 px-10 mt-2">
          <button
            onClick={() => value > 0 && decrement()}
            className="w-8 h-8 flex items-center justify-center bg-premium-background dark:bg-premium-backgroundDark text-premium-textSecondary dark:text-premium-textPrimary rounded-l-md transition-colors hover:bg-premium-primary hover:text-white"
          >
            -
          </button>
          <input
            readOnly
            type="text"
            value={value}
            className="w-12 text-center bg-premium-background dark:bg-premium-backgroundDark text-premium-textPrimary dark:text-premium-textPrimary border border-premium-borderColor dark:border-premium-borderColorHover"
          />
          <button
            onClick={increment}
            className="w-8 h-8 flex items-center justify-center bg-premium-background dark:bg-premium-backgroundDark text-premium-textSecondary dark:text-premium-textPrimary rounded-r-md transition-colors hover:bg-premium-primary hover:text-white"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
