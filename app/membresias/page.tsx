"use client";

import { useState } from "react";
import { Metadata } from "next";
import { useMemberships } from "@/app/hooks/memberships/useMemberships";
import { useIsLgUp } from "@/app/hooks/useIsLgUp";
import MembershipCard from "@/app/ui/memberships/membershipCard";
import MembershipCardSkeleton from "@/app/ui/skeletons/membershipCardSkeleton";

export const metadata: Metadata = {
  title: "Membresías | EdifiK",
  description:
    "Activa una membresía para publicar más propiedades, mejorar tu visibilidad y acceder a herramientas premium.",
};

export default function MembershipsPage() {
  const [refresh, setRefresh] = useState(0);

  const isLgUp = useIsLgUp();

  const { memberships, isLoading } = useMemberships(1, 4, "", refresh);

  const membershipStyles: Record<
    number,
    {
      bg: string;
      text: string;
      icon: string;
      button: string;
      price: string;
      divider: string;
    }
  > = {
    1001: {
      bg: "bg-client-accent",
      text: "text-client-text",
      icon: "text-client-text",
      button: "bg-client-white text-client-primary",
      price: "text-client-white",
      divider: "border-client-primary",
    },
    1002: {
      bg: "bg-client-whiteOff",
      text: "text-client-primary",
      icon: "text-client-primary",
      button: "bg-client-accent text-white",
      price: "text-client-accent",
      divider: "border-client-primary",
    },
    1003: {
      bg: "bg-client-accent",
      text: "text-client-text",
      icon: "text-client-text",
      button: "bg-client-white text-client-primary",
      price: "text-client-white",
      divider: "border-client-primary",
    },
  };

  return (
    <>
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl my-12 font-bold text-center text-client-text">
            Elige tu membresía
          </h2>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <MembershipCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {memberships
                .filter((m) => m.id !== 1004)
                .map((m) => {
                  const colorScheme = membershipStyles[m.id] ?? {
                    bg: "bg-gray-100",
                    text: "text-black",
                    icon: "text-black",
                    button: "bg-black text-white",
                    price: "text-black",
                    divider: "border-gray-300",
                  };

                  return (
                    <MembershipCard
                      key={m.id}
                      name={m.name}
                      benefits={m.benefits}
                      price={m.price}
                      yearlyPrice={
                        m.price * 12 +
                        (m.price * m.discountTwelveMonths * 12) / 100
                      }
                      featured={m.projectsFeatured}
                      maxProperties={m.maxProjects}
                      isMain={isLgUp && m.id === 1002}
                      colorScheme={colorScheme}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
