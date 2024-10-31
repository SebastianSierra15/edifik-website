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
            value > 1
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

      {/* Numeric counter section */}
      {isOpen && (
        <div className="flex items-center justify-center space-x-1 px-10 mt-2">
          <button
            onClick={() => value > 1 && decrement()}
            className="w-8 h-8 flex items-center justify-center bg-background dark:bg-backgroundDark text-textSecondary dark:text-textPrimary rounded-l-md transition-colors hover:bg-primary hover:text-white"
          >
            -
          </button>
          <input
            readOnly
            type="text"
            value={value}
            className="w-12 text-center bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover"
          />
          <button
            onClick={increment}
            className="w-8 h-8 flex items-center justify-center bg-background dark:bg-backgroundDark text-textSecondary dark:text-textPrimary rounded-r-md transition-colors hover:bg-primary hover:text-white"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
