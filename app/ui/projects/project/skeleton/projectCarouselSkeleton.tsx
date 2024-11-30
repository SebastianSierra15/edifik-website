export function ProjectCarouselSkeleton() {
  return (
    <div className="relative w-full mx-auto sm:my-5 px-8">
      <div className="relative flex justify-center items-center overflow-hidden h-80">
        {[...Array(5)].map((_, index) => {
          const positions = [
            {
              translateX: "-120%",
              scale: "scale-50",
              zIndex: "z-0",
              width: "300px",
              height: "200px",
            },
            {
              translateX: "-60%",
              scale: "scale-75",
              zIndex: "z-5",
              width: "400px",
              height: "250px",
            },
            {
              translateX: "0%",
              scale: "scale-100",
              zIndex: "z-10",
              width: "500px",
              height: "300px",
            },
            {
              translateX: "60%",
              scale: "scale-75",
              zIndex: "z-5",
              width: "400px",
              height: "250px",
            },
            {
              translateX: "120%",
              scale: "scale-50",
              zIndex: "z-0",
              width: "300px",
              height: "200px",
            },
          ];

          return (
            <div
              key={index}
              className={`absolute bg-gray-300 rounded-lg animate-pulse ${positions[index].scale} ${positions[index].zIndex}`}
              style={{
                width: positions[index].width,
                height: positions[index].height,
                transform: `translateX(${positions[index].translateX})`,
                transition: "transform 0.5s ease, scale 0.5s ease",
              }}
            ></div>
          );
        })}
      </div>

      <button className="absolute top-1/2 left-2 sm:left-3 lg:left-4 transform -translate-y-1/2 bg-gray-300 rounded-full w-8 h-8 animate-pulse"></button>
      <button className="absolute top-1/2 right-2 sm:right-3 lg:right-4 transform -translate-y-1/2 bg-gray-300 rounded-full w-8 h-8 animate-pulse"></button>

      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 ${
              index === 2 ? "bg-gray-400 scale-125" : "bg-gray-300"
            } rounded-full animate-pulse`}
          ></div>
        ))}
      </div>
    </div>
  );
}
