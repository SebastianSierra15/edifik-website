import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface NumericCounterProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  value: number;
  increment: () => void;
  decrement: () => void;
}

export function FilterNumericCounter({
  label,
  icon,
  isOpen,
  setIsOpen,
  value,
  increment,
  decrement,
}: NumericCounterProps) {
  return (
    <>
      <div
        className="flex transform cursor-pointer items-center justify-between transition-transform duration-200 hover:scale-105 hover:font-semibold text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 text-lg font-medium",
            value > 0 && "text-client-accent"
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
        <div className="mt-2 flex items-center justify-center space-x-1 px-10 text-white">
          <button
            onClick={() => value > 0 && decrement()}
            className="flex h-8 w-8 items-center justify-center rounded-l-md transition-colors hover:bg-client-accentHover"
          >
            -
          </button>

          <input
            readOnly
            type="text"
            value={value}
            className="w-12 bg-transparent border border-client-accent text-center"
          />

          <button
            onClick={increment}
            className="flex h-8 w-8 items-center justify-center rounded-r-md transition-colors hover:bg-client-accentHover"
          >
            +
          </button>
        </div>
      )}
    </>
  );
}
