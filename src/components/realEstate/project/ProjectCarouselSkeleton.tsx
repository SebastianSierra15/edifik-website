import clsx from "clsx";

export function ProjectCarouselSkeleton() {
  return (
    <div className="relative mx-auto w-full px-8 sm:my-5">
      <div className="relative flex h-80 items-center justify-center overflow-hidden">
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
              className={clsx(
                "absolute animate-pulse rounded-lg bg-gray-300",
                positions[index].scale,
                positions[index].zIndex
              )}
              style={{
                width: positions[index].width,
                height: positions[index].height,
                transform: `translateX(${positions[index].translateX})`,
                transition: "transform 0.5s ease, scale 0.5s ease",
              }}
            />
          );
        })}
      </div>

      <button className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 transform animate-pulse rounded-full bg-gray-300 sm:left-3 lg:left-4" />
      <button className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 transform animate-pulse rounded-full bg-gray-300 sm:right-3 lg:right-4" />

      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              "h-2 w-2 animate-pulse rounded-full",
              index === 2 ? "scale-125 bg-gray-400" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
