import clsx from "clsx";
import { ClientTooltipIcon } from "./ClientTooltipIcon";

interface ClientFormDisplayProps {
  label: string;
  value: string | number;
  tooltipText?: string;
  rows?: number;
}

export function ClientFormDisplay({
  label,
  value,
  tooltipText,
  rows = 1,
}: ClientFormDisplayProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-client-text">
        {label}
        {tooltipText && <ClientTooltipIcon tooltipText={tooltipText} />}
      </label>

      <div
        className={clsx(
          "w-full rounded-md border bg-client-backgroundLight px-3 py-2 text-client-text border-client-accent break-words overflow-x-hidden",
          rows > 1 ? `h-${rows * 8} overflow-y-auto` : "h-auto"
        )}
        style={{ minHeight: `${rows * 1.5}rem` }}
      >
        {value || "No especificado"}
      </div>
    </div>
  );
}
