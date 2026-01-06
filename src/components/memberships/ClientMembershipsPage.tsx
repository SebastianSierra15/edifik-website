"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Membership } from "@/src/interfaces";
import { usePublicMemberships } from "@/src/hooks/memberships";
import { useAuth } from "@/src/hooks/auth";
import { useIsLgUp } from "@/src/hooks/ui";
import {
  MembershipCard,
  MembershipPaymentModal,
  MembershipCardSkeleton,
} from "@/src/components/memberships";

const TAX_RATE = 1.19;

const calculateThreeMonthPrice = (
  price: number,
  discountThreeMonths?: number | null
) => {
  const priceWithTax = price * TAX_RATE;
  return (
    priceWithTax * 3 -
    (priceWithTax * (discountThreeMonths ?? 0) * 3) / 100
  );
};

export function ClientMembershipsPage() {
  const [selectedMembership, setSelectedMembership] =
    useState<Membership | null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const isLgUp = useIsLgUp();
  const { memberships, isLoading: isMembershipsLoading } =
    usePublicMemberships(1, 4, "", 0);

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

  const handleBuyMembership = (membership: Membership) => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setSelectedMembership(membership);
  };

  return (
    <>
      <section className="w-full py-10 mb-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl my-12 font-bold text-center text-client-text">
            Elige tu membresía
          </h2>

          {isMembershipsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {[1001, 1002, 1003].map((id) => (
                <MembershipCardSkeleton
                  key={id}
                  backgroundClassName={
                    membershipStyles[id]?.bg ?? "bg-gray-100"
                  }
                />
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
                      price={m.price * TAX_RATE}
                      threeMounthPrice={calculateThreeMonthPrice(
                        m.price,
                        m.discountThreeMonths
                      )}
                      featured={m.projectsFeatured ?? 0}
                      maxProperties={m.maxProjects}
                      isMain={isLgUp && m.id === 1002}
                      colorScheme={colorScheme}
                      onBuy={() => handleBuyMembership(m)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {selectedMembership && (
        <MembershipPaymentModal
          membership={selectedMembership}
          isOpen={true}
          onClose={() => setSelectedMembership(null)}
        />
      )}
    </>
  );
}
