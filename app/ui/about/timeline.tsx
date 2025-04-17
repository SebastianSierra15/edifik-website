"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          circle.classList.add("bg-client-accentLight");
          circle.classList.remove("bg-transparent");
        } else {
          circle.classList.remove("bg-accentLight");
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
          img.classList.toggle("hidden", index !== 0)
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
    <section className="p-10 lg:p-14 bg-client-backgroundAlt">
      <div className="xl:w-3/4 bg-transparent mx-auto">
        <h2 className="text-center text-3xl font-bold text-white lg:text-4xl">
          Nuestra Historia
        </h2>

        <hr className="mx-auto my-2 w-1/3 border-t border-white" />

        <div className="lg:mt-15 relative mt-10 flex h-auto w-full">
          <button
            ref={prevButtonRef}
            className="absolute -left-10 z-10 p-2 self-center bg-client-primaryLight rounded-full hover:bg-client-secondaryDark transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-client-text" />
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
                ImageTitle="Quintas del Lago"
                year="15 enero 2024"
                title="Quintas del Lago"
                description="Quintas del Lago es un proyecto de vivienda campestre sostenible en Villavicencio, con 86 lotes distribuidos en 12 etapas, rodeado de lagos, zonas verdes y senderos ecológicos."
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
                ImageTitle="Edificio San Carlos"
                year="16 mayo 2024"
                title="Edificio San Carlos en Florencia Caquetá"
                description="Edificio San Carlos es un exclusivo proyecto de vivienda en Florencia, Caquetá. Ofrece apartamentos de 1, 2 y 3 habitaciones, con zonas sociales como terraza, BBQ, jacuzzi y lobby. Su entorno natural, alta valorización y desarrollo."
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
            className="absolute -right-10 z-10 p-2 self-center bg-client-primaryLight rounded-full hover:bg-client-secondaryDark transition-all"
          >
            <ChevronRight className="w-6 h-6 text-client-text" />
          </button>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-client-backgroundAlt to-transparent" />
        </div>
      </div>
    </section>
  );
}
