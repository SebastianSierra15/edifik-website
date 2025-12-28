interface MembershipCardSkeletonProps {
  backgroundClassName: string;
}

export function MembershipCardSkeleton({
  backgroundClassName,
}: MembershipCardSkeletonProps) {
  return (
    <div
      className={`w-full max-w-xs h-[460px] rounded-3xl px-6 py-8 shadow-md flex flex-col justify-between ${backgroundClassName}`}
    >
      <div className="flex flex-col gap-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto animate-pulse" />

        <div className="text-center">
          <div className="h-10 w-28 bg-gray-300 rounded mx-auto animate-pulse" />
          <div className="h-4 w-20 mx-auto mt-2 bg-gray-300 rounded animate-pulse" />
        </div>

        <ul className="flex flex-col gap-4 text-sm">
          {[...Array(3)].map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b border-gray-300 pb-2"
            >
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-300 rounded animate-pulse" />
            </li>
          ))}
        </ul>
      </div>

      <div className="h-10 bg-gray-300 rounded-full w-full mt-6 animate-pulse" />
    </div>
  );
}
