export default function ProjectCardSkeleton() {
  return (
    <div className="bg-transparent dark:bg-transparent rounded-lg transform transition-transform hover:scale-105 duration-300">
      <div
        className={`relative max-w-xs shadow-premium-secondary dark:shadow-white rounded-lg overflow-hidden bg-premium-secondary dark:bg-premium-secondaryDark cursor-pointer shadow-md dark:shadow-md h-[370px]`}
      >
        <div className="relative w-full h-[80%] bg-premium-backgroundLight dark:bg-premium-backgroundDark animate-pulse"></div>

        <div className="absolute top-2 left-2 bg-premium-borderColor dark:bg-premium-borderColorHover text-white text-sm px-2 py-1 rounded-full w-20 h-6 animate-pulse"></div>

        <div className="px-2 pt-16 pb-2 z-20 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-premium-secondaryDark dark:from-black via-premium-secondaryDark dark:via-gray-800 to-transparent">
          <div className="w-3/4 h-4 bg-premium-backgroundLight dark:bg-premium-backgroundDark rounded animate-pulse mb-2"></div>
          <div className="w-1/2 h-3 bg-premium-backgroundLight dark:bg-premium-backgroundDark rounded animate-pulse mb-1"></div>
          <div className="w-1/4 h-3 bg-premium-backgroundLight dark:bg-premium-backgroundDark rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
