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
            value > 0
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
        <div className="mt-2 flex items-center justify-center space-x-1 px-10">
          <button
            onClick={() => value > 0 && decrement()}
            className="flex h-8 w-8 items-center justify-center rounded-l-md bg-premium-background text-premium-textSecondary transition-colors hover:bg-premium-primary hover:text-white dark:bg-premium-backgroundDark dark:text-premium-textPrimary"
          >
            -
          </button>
          <input
            readOnly
            type="text"
            value={value}
            className="w-12 border border-premium-borderColor bg-premium-background text-center text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary"
          />
          <button
            onClick={increment}
            className="flex h-8 w-8 items-center justify-center rounded-r-md bg-premium-background text-premium-textSecondary transition-colors hover:bg-premium-primary hover:text-white dark:bg-premium-backgroundDark dark:text-premium-textPrimary"
          >
            +
          </button>
        </div>
      )}
    </>
  );
}
