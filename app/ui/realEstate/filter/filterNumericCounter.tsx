import dynamic from "next/dynamic";
import clsx from "clsx";

const ChevronDown = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronDown)
);

interface NumericCounterProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  value: number;
  increment: () => void;
  decrement: () => void;
}

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
    <>
      <div
        className="flex transform cursor-pointer items-center justify-between transition-transform duration-200 hover:scale-105 hover:font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 text-lg font-medium",
            value > 0 ? "text-client-primary" : "text-black"
          )}
        >
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          className={clsx(
            "transform transition-transform duration-300",
            isOpen && "rotate-180",
            "text-black"
          )}
        />
      </div>

      {isOpen && (
        <div className="mt-2 flex items-center justify-center space-x-1 px-10">
          <button
            onClick={() => value > 0 && decrement()}
            className="flex h-8 w-8 items-center justify-center rounded-l-md bg-gray-300 text-black transition-colors hover:bg-client-secondaryLight"
          >
            -
          </button>

          <input
            readOnly
            type="text"
            value={value}
            className="w-12 border border-gray-300 bg-white text-center text-black"
          />

          <button
            onClick={increment}
            className="flex h-8 w-8 items-center justify-center rounded-r-md bg-gray-300 text-black transition-colors hover:bg-client-secondaryLight"
          >
            +
          </button>
        </div>
      )}
    </>
  );
}
