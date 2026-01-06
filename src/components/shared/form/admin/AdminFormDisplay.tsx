import clsx from "clsx";
import { AdminTooltipIcon } from "./AdminTooltipIcon";

interface AdminFormDisplayProps {
  label: string;
  value: string | number;
  tooltipText?: string;
  rows?: number;
}

export function AdminFormDisplay({
  label,
  value,
  tooltipText,
  rows = 1,
}: AdminFormDisplayProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
        {label}
        {tooltipText && <AdminTooltipIcon tooltipText={tooltipText} />}
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
