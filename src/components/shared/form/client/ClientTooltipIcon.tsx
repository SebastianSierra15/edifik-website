import { Info } from "lucide-react";

interface ClientTooltipIconProps {
  tooltipText: string;
}

export function ClientTooltipIcon({ tooltipText }: ClientTooltipIconProps) {
  return (
    <span className="group relative">
      <Info className="h-4 w-4 cursor-pointer text-client-secondaryHover" />
      <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-client-accent bg-client-backgroundLight p-2 text-client-text shadow-md group-hover:flex">
        <p className="text-xs">{tooltipText}</p>
      </div>
    </span>
  );
}
