import { Info } from "lucide-react";

interface AdminTooltipIconProps {
  tooltipText: string;
}

export function AdminTooltipIcon({ tooltipText }: AdminTooltipIconProps) {
  return (
    <span className="group relative">
      <Info className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
      <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
        <p className="text-xs">{tooltipText}</p>
      </div>
    </span>
  );
}
