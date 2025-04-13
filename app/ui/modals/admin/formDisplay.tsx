import clsx from "clsx";
import TooltipIcon from "./tooltipIcon";

interface FormDisplayProps {
  label: string;
  value: string | number;
  tooltipText?: string;
  rows?: number;
}

export default function FormDisplay({
  label,
  value,
  tooltipText,
  rows = 1,
}: FormDisplayProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
        {label}
        {tooltipText && <TooltipIcon tooltipText={tooltipText} />}
      </label>

      <div
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover",
          rows > 1 ? `h-${rows * 8} overflow-y-auto` : "h-auto"
        )}
        style={{ minHeight: `${rows * 1.5}rem` }}
      >
        {value || "No especificado"}
      </div>
    </div>
  );
}
