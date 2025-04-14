"use client";

import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

interface MembershipCardProps {
  name: string;
  benefits: string;
  price: number;
  yearlyPrice: number;
  featured: number;
  maxProperties: number;
  colorScheme: {
    bg: string;
    text: string;
    icon: string;
    button: string;
    price: string;
    divider: string;
  };
  isMain?: boolean;
}

export default function MembershipCard({
  name,
  benefits,
  price,
  yearlyPrice,
  featured,
  maxProperties,
  colorScheme,
  isMain = false,
}: MembershipCardProps) {
  return (
    <div
      className={clsx(
        "relative flex flex-col justify-between rounded-3xl px-6 py-8 shadow-lg transition-transform duration-300 w-full max-w-xs h-[460px]",
        colorScheme.bg,
        colorScheme.text,
        isMain ? "scale-110 shadow-xl" : "scale-100"
      )}
    >
      <div className="flex flex-col gap-6">
        <h3
          className={clsx(
            "text-center text-xl font-semibold tracking-wide uppercase",
            colorScheme.price
          )}
        >
          {name}
        </h3>

        <div className={clsx("text-center", colorScheme.price)}>
          <div className="flex justify-center items-baseline gap-1">
            <span className="text-lg">$</span>
            <span className="text-4xl font-extrabold">
              {formatNumber(price)}
            </span>
            <span className="text-sm opacity-80">/mes</span>
          </div>
          <p className="text-sm opacity-80 mt-1">
            $ {formatNumber(yearlyPrice)}/año
          </p>
        </div>

        <ul className="flex flex-col gap-4 text-sm">
          <li
            className={clsx(
              "flex items-center justify-between border-b pb-2",
              colorScheme.divider
            )}
          >
            <span>Propiedades destacadas</span>
            <span className="font-semibold">{featured}</span>
          </li>

          <li
            className={clsx(
              "flex items-center justify-between border-b pb-2",
              colorScheme.divider
            )}
          >
            <span>Máximo de propiedades</span>
            <span className="font-semibold">{maxProperties}</span>
          </li>

          <li className="flex items-start gap-2 pt-2">
            <CheckCircle
              className={clsx("w-5 h-5 flex-shrink-0", colorScheme.icon)}
            />
            <p className="flex-1">{benefits}</p>
          </li>
        </ul>
      </div>

      <button
        className={clsx(
          "w-full py-3 rounded-full text-black font-semibold hover:opacity-90 transition mt-6",
          colorScheme.button
        )}
      >
        Comprar
      </button>
    </div>
  );
}
