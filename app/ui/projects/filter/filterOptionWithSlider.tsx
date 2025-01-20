import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

const ChevronDown = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronDown)
);

type FilterOptionWithSliderProps = {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: string;
  prefixText: string;
  suffixText: string;
};

export default function FilterOptionWithSlider({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  isOpen,
  setIsOpen,
  category,
  prefixText,
  suffixText,
}: FilterOptionWithSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);
  };

  const handleSliderComplete = () => {
    onChange(sliderValue);
  };

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const formatDisplayValue = (value: number) => {
    if (value >= 1000000000) {
      const newValue = value / 1000000000;
      return `${newValue.toFixed(3)}M`;
    } else if (value >= 1000000) {
      const newValue = value / 1000000;
      return Number.isInteger(newValue)
        ? `${newValue}M`
        : `${newValue.toFixed(1)}M`;
    } else if (value >= 100000) {
      const newValue = value / 1000;
      return Number.isInteger(newValue)
        ? `${newValue}K`
        : `${newValue.toFixed(1)}K`;
    } else if (value >= 1000) {
      const newValue = value / 1000;
      return newValue.toFixed(3);
    } else {
      return value.toString();
    }
  };

  return (
    <>
      <div
        className="mb-4 flex transform cursor-pointer items-center justify-between text-premium-textPrimary transition-transform duration-200 hover:scale-105 hover:font-semibold dark:text-premium-textPrimary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 text-lg font-medium",
            sliderValue > 1
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
        <div className="mb-6 flex flex-col items-center space-y-2 px-4">
          <input
            type="range"
            min={min}
            max={max}
            step={sliderValue > 10000000 ? 10000000 : step}
            value={sliderValue}
            onChange={handleSliderChange}
            onMouseUp={handleSliderComplete}
            onTouchEnd={handleSliderComplete}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-premium-primary dark:bg-premium-primaryLight"
          />
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              background-color: var(--primary);
              border-radius: 50%;
              cursor: pointer;
              border: 2px solid var(--backgroundAlt);
            }

            input[type="range"]::-moz-range-thumb {
              height: 20px;
              width: 20px;
              background-color: var(--primary);
              border-radius: 50%;
              cursor: pointer;
              border: 2px solid var(--backgroundAlt);
            }

            input[type="range"]::-ms-thumb {
              height: 20px;
              width: 20px;
              background-color: var(--primary);
              border-radius: 50%;
              cursor: pointer;
              border: 2px solid var(--backgroundAlt);
            }
          `}</style>
          {sliderValue > 1 && (
            <div className="text-center text-base text-premium-textPrimary dark:text-premium-textPrimary">
              <span>{prefixText} </span>
              <span className="text-2xl font-bold">
                {category === "price" ? "$" : "+"}
                {formatDisplayValue(sliderValue)}
              </span>
              <span> {suffixText}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
