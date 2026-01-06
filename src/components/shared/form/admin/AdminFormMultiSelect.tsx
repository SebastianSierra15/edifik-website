import { X } from "lucide-react";
import { AdminTooltipIcon } from "./AdminTooltipIcon";

interface AdminFormMultiSelectProps {
  label: string;
  name: "commonAreas" | "nearbyServices";
  selectedItems: { id: number; name: string }[];
  options: { id: number; name: string }[];
  onSelect: (
    e: React.ChangeEvent<HTMLSelectElement>,
    name: "commonAreas" | "nearbyServices"
  ) => void;
  onRemove: (id: number, name: "commonAreas" | "nearbyServices") => void;
  tooltipText?: string;
}

export function AdminFormMultiSelect({
  label,
  name,
  selectedItems,
  options,
  onSelect,
  onRemove,
  tooltipText,
}: AdminFormMultiSelectProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary"
      >
        {label}
        {tooltipText && <AdminTooltipIcon tooltipText={tooltipText} />}
      </label>
      <select
        id={name}
        name={name}
        onChange={(e) => onSelect(e, name)}
        className="w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
      >
        <option value="">Seleccione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="mt-2 flex flex-wrap">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="m-1 flex items-center rounded-full bg-premium-primary px-3 py-1 text-white dark:bg-premium-primaryLight"
          >
            {item.name}
            <button
              className="ml-2 text-white hover:text-premium-textPrimary"
              onClick={() => onRemove(item.id, name)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
