"use client";

import { useState, useEffect, useRef } from "react";
import { Property } from "@/lib/definitios";
import { usePropertyByName } from "@/app/hooks/usePropertyByName";
import PropertyHeader from "@/app/ui/properties/property/propertyHeader";
import PropertyDetails from "@/app/ui/properties/property/propertyDetails";
import PropertyNearbyServices from "@/app/ui/properties/property/propertyNearbyServices";
import PropertyCommonAreas from "@/app/ui/properties/property/propertyCommonAreas";
import PropertyCarousel from "@/app/ui/properties/property/propertyCarousel";
import ContactForm from "@/app/ui/properties/contactForm";
import Map from "@/app/ui/properties/property/map";
import RecommendedProperties from "@/app/ui/properties/property/recommendedProperties";

export default function PropertyPage({ params }: { params: { name: string } }) {
  const { property } = usePropertyByName(params.name);
  const [isFixed, setIsFixed] = useState(false);
  const contactFormRef = useRef<HTMLDivElement | null>(null);
  const endOfPageRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === carouselRef.current) {
          setIsFixed(!entry.isIntersecting);
        }
        if (entry.target === endOfPageRef.current) {
          setIsFixed(entry.isIntersecting ? false : isFixed);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, observerOptions);

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    if (endOfPageRef.current) {
      observer.observe(endOfPageRef.current);
    }

    return () => {
      if (carouselRef.current) observer.unobserve(carouselRef.current);
      if (endOfPageRef.current) observer.unobserve(endOfPageRef.current);
    };
  }, [isFixed]);

  return (
    <div
      className="w-screen min-h-screen"
      style={{ backgroundColor: "#EDEDED", color: "#5D4037" }}
    >
      {property && (
        <>
          <PropertyHeader property={property} />

          <div ref={carouselRef}>
            <PropertyCarousel propertyMedia={property.propertyMedia} />
          </div>

          <div className="flex justify-center mt-4">
            <hr
              className="w-3/4"
              style={{
                borderTop: "2px solid #DAA520",
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-8">
            <div className="lg:col-span-2 pl-16 pr-16 lg:pr-10">
              <p className="text-lg my-8" style={{ color: "#000000" }}>
                {property.shortDescription}
              </p>

              <PropertyDetails property={property} />

              <div className="text-base my-8">
                <h2
                  className="text-2xl font-semibold mb-2"
                  style={{ color: "#8B4513" }}
                >
                  Descripción General
                </h2>
                <p style={{ color: "#000000" }}>
                  {property.detailedDescription}
                </p>
              </div>

              {property.nearbyService && property.nearbyService.length > 0 && (
                <PropertyNearbyServices services={property.nearbyService} />
              )}

              <PropertyCommonAreas
                areas={property.commonAreas}
                propertyMedia={property.propertyMedia}
              />

              <Map
                latitude={property.latitude}
                longitude={property.longitude}
                address={property.address}
              />

              <div ref={endOfPageRef} className="h-10"></div>
            </div>

            <div
              ref={contactFormRef}
              className={`transition-all pt-8 duration-300 pr-8 ${
                isFixed ? "fixed top-20 right-8 w-64 z-10" : "relative"
              }`}
            >
              <ContactForm />
            </div>
          </div>

        </>
      )}
    </div>
  );
}
