export default function ProjectDetailsSkeleton() {
  const skeletonGroups = Array(3).fill(0);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-6 text-[#8B4513]">
        Detalles del Proyecto
      </h2>
      <div className="space-y-6">
        {skeletonGroups.map((_, index) => (
          <div key={index} className="mb-4">
            <div
              className="p-4 rounded-lg shadow flex justify-between items-center"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></span>
              <div className="h-4 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg shadow flex flex-col space-y-2 animate-pulse"
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
