export default function ProjectDetailsSkeleton() {
  const skeletonGroups = Array(3).fill(0);

  return (
    <div className="my-8">
      <h2 className="mb-6 text-2xl font-semibold text-[#8B4513]">
        Detalles del Proyecto
      </h2>
      <div className="space-y-6">
        {skeletonGroups.map((_, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex items-center justify-between rounded-lg p-4 shadow"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="h-4 w-1/3 animate-pulse rounded bg-gray-300"></span>
              <div className="h-4 w-5 animate-pulse rounded-full bg-gray-300"></div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="flex animate-pulse flex-col space-y-2 rounded-lg p-4 shadow"
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
