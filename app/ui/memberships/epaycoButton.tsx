"use client";

import { useEffect, useRef } from "react";

interface EpaycoButtonProps {
  amount: number;
  tax: number;
  taxBase: number;
  name: string;
  description: string;
}

export default function EpaycoButton({
  amount,
  tax,
  taxBase,
  name,
  description,
}: EpaycoButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const publicKey = process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY;

  useEffect(() => {
    if (formRef.current) {
      formRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://checkout.epayco.co/checkout.js";
    script.className = "epayco-button";
    script.setAttribute("data-epayco-key", publicKey ?? "");
    script.setAttribute("data-epayco-amount", amount.toString());
    script.setAttribute("data-epayco-tax", tax.toFixed(2).toString());
    script.setAttribute("data-epayco-tax-base", taxBase.toString());
    script.setAttribute("data-epayco-name", name);
    script.setAttribute("data-epayco-description", description);
    script.setAttribute("data-epayco-currency", "cop");
    script.setAttribute("data-epayco-country", "co");
    script.setAttribute("data-epayco-response", "www.google.com");
    script.setAttribute("data-epayco-test", "false");
    script.setAttribute("data-epayco-external", "false");
    script.setAttribute(
      "data-epayco-button",
      "https://multimedia.epayco.co/dashboard/btns/btn5.png"
    );

    formRef.current?.appendChild(script);
  }, [amount, tax, taxBase, name, description]);

  return <form ref={formRef}></form>;
}
