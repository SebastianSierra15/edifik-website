import { X } from "lucide-react";

export function FilterSkeleton() {
  return (
    <div className="w-full rounded-lg bg-client-backgroundAlt text-white py-4 px-4 shadow-md sm:w-72 md:w-80 animate-pulse">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="w-28 h-5 bg-client-secondaryLight rounded" />
        <X className="text-client-secondaryLight" size={18} />
      </div>

      <hr className="border-client-accent mb-4" />

      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`option-${i}`}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-client-secondaryLight rounded" />
              <div className="w-48 h-7 bg-client-secondaryLight rounded" />
            </div>
            <div className="w-8 h-8 bg-client-secondaryLight rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
