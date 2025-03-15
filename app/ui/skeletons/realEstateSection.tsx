export default function RealEstateSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-3 lg:gap-x-6 gap-y-2">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-client-background-alt py-2 rounded-lg">
          <div className="relative w-full h-80 rounded-lg bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-600 rounded mt-2"></div>
          <div className="h-6 w-40 bg-gray-500 rounded mt-1"></div>
        </div>
      ))}
    </div>
  );
}
