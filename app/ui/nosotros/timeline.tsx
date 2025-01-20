"use client";

import { useEffect, useRef, useState } from "react";
import TimelineElement from "./timeLineElement";

export default function Timeline() {
  const timeLineRef = useRef<HTMLDivElement>(null);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [currentIndexCircle, setCurrentIndexCircle] = useState(0);

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timeLineElements = document.querySelectorAll(".timeline-element");
    const itemElement = document.querySelector(".flex-none") as HTMLElement;
    const itemWidth = itemElement.offsetWidth;
    const maxIndex = timeLineElements.length - 1;

    function updateCircles() {
      timeLineElements.forEach((element, index) => {
        const circle = element.querySelector(".circle")!;
        if (index === currentIndexCircle) {
          circle.classList.add("bg-blue-500");
          circle.classList.remove("bg-transparent");
        } else {
          circle.classList.remove("bg-blue-500");
          circle.classList.add("bg-transparent");
        }
      });
    }

    updateCircles();

    const prevButton = prevButtonRef.current;
    const nextButton = nextButtonRef.current;
    const timeLine = timeLineRef.current;

    const handlePrevClick = () => {
      if (currentTranslate < 0) {
        setCurrentTranslate((prev) => prev + itemWidth);
        timeLine!.style.transform = `translateX(${
          currentTranslate + itemWidth
        }px)`;
      }
      if (currentIndexCircle > 0) {
        setCurrentIndexCircle((prev) => Math.max(0, prev - 1));
        updateCircles();
      }
    };

    const handleNextClick = () => {
      const maxTranslate = -(
        timeLine!.scrollWidth - timeLine!.parentElement!.offsetWidth
      );
      if (currentTranslate > maxTranslate) {
        setCurrentTranslate((prev) => prev - itemWidth);
        timeLine!.style.transform = `translateX(${
          currentTranslate - itemWidth
        }px)`;
      }
      if (currentIndexCircle < maxIndex) {
        setCurrentIndexCircle((prev) => Math.min(maxIndex, prev + 1));
        updateCircles();
      }
    };

    prevButton?.addEventListener("click", handlePrevClick);
    nextButton?.addEventListener("click", handleNextClick);

    return () => {
      prevButton?.removeEventListener("click", handlePrevClick);
      nextButton?.removeEventListener("click", handleNextClick);
    };
  }, [currentTranslate, currentIndexCircle]);

  useEffect(() => {
    const timeLineElements = document.querySelectorAll(".timeline-element");

    timeLineElements.forEach((element) => {
      const images = element.querySelectorAll(".image");
      let currentIndex = 0;
      let interval: NodeJS.Timeout;

      function showNextImage() {
        images[currentIndex].classList.add("hidden");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove("hidden");
      }

      function startImageRotation() {
        interval = setInterval(showNextImage, 1000);
      }

      function stopImageRotation() {
        clearInterval(interval);
        images.forEach((img, index) =>
          img.classList.toggle("hidden", index !== 0),
        );
        currentIndex = 0;
      }

      const imageContainer = element.querySelector(".image-container")!;
      imageContainer.addEventListener("mouseenter", startImageRotation);
      imageContainer.addEventListener("mouseleave", stopImageRotation);

      return () => {
        imageContainer.removeEventListener("mouseenter", startImageRotation);
        imageContainer.removeEventListener("mouseleave", stopImageRotation);
      };
    });
  }, []);

  return (
    <section className="bg-gray-200 p-10 lg:p-20">
      <div className="mx-auto bg-transparent xl:w-3/4">
        <h2 className="text-center text-2xl font-semibold text-blue-600 lg:text-4xl">
          Nuestra Historia
        </h2>
        <div className="w-full text-center">
          <div className="mx-auto my-2 w-1/3 border-t border-blue-400"></div>
        </div>

        <div className="lg:mt-15 relative mt-10 flex h-auto w-full">
          <button
            ref={prevButtonRef}
            className="absolute -left-10 z-10 h-10 w-10 self-center rounded-full border-2 border-blue-500 bg-transparent text-blue-500 transition duration-300 hover:bg-gray-300"
          >
            &#10094;
          </button>

          <div className="flex w-full overflow-hidden">
            <div
              ref={timeLineRef}
              id="timeLine"
              className="flex whitespace-nowrap transition-transform duration-500"
            >
              <TimelineElement
                ImageSrc1="/images/image2.jpg"
                ImageSrc2="/images/image3.jpg"
                ImageSrc3="/images/image4.jpg"
                ImageTitle="Project 2023"
                year="2023"
                title="Quintas del Lago"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />

              <TimelineElement
                ImageSrc1="/images/image5.jpg"
                ImageSrc2="/images/image6.jpg"
                ImageSrc3="/images/image7.jpg"
                ImageTitle="Project 2022"
                year="2022"
                title="Quintas del Lago 2"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />

              <TimelineElement
                ImageSrc1="/images/image8.jpg"
                ImageSrc2="/images/image9.jpg"
                ImageSrc3="/images/image10.jpg"
                ImageTitle="Project 2021"
                year="2021"
                title="Quintas del Lago 3"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />

              <TimelineElement
                ImageSrc1="/images/image11.jpg"
                ImageSrc2="/images/image12.jpg"
                ImageSrc3="/images/image13.jpg"
                ImageTitle="Project 2020"
                year="2020"
                title="Quintas del Lago 4"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />

              <TimelineElement
                ImageSrc1="/images/image14.jpg"
                ImageSrc2="/images/image15.jpg"
                ImageSrc3="/images/image16.jpg"
                ImageTitle="Project 2019"
                year="2019"
                title="Quintas del Lago 5"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />

              <TimelineElement
                ImageSrc1="/images/image17.jpg"
                ImageSrc2="/images/image18.jpg"
                ImageSrc3="/images/image19.jpg"
                ImageTitle="Project 2018"
                year="2018"
                title="Quintas del Lago 6"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci numquam similique quasi dolore tempore repellendus porro, ipsa ex nobis."
                isActive={false}
              />
            </div>
          </div>

          <button
            ref={nextButtonRef}
            className="absolute -right-10 z-10 h-10 w-10 self-center rounded-full border-2 border-blue-500 bg-transparent text-blue-500 transition duration-300 hover:bg-gray-300"
          >
            &#10095;
          </button>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-200 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
