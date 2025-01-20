"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);
  const [formState, setFormState] = useState<"fixed" | "bottom" | "default">(
    "default"
  );
  const [formOffset, setFormOffset] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
      // Reset form state for small screens
      setFormState("default");
      return;
    }

    const handleScroll = () => {
      const formElement = formRef.current;
      const footerElement = document.querySelector("footer");
      const windowHeight = window.innerHeight;

      if (!formElement || !footerElement) return;

      const formHeight = formElement.offsetHeight;
      const formRect = formElement.getBoundingClientRect();
      const footerRect = footerElement.getBoundingClientRect();
      const pageHeight = document.documentElement.scrollHeight;

      // Calculate stop position
      const stopPosition = pageHeight - (800 + formHeight);

      // Adjust form to bottom if footer is visible
      if (footerRect.top <= windowHeight) {
        if (formState !== "bottom") {
          setFormOffset(stopPosition);
          setFormState("bottom");
        }
        return;
      }

      // Fix form when scrolling past a point
      if (window.scrollY > 400 && formRect.top <= 32) {
        if (formState !== "fixed") {
          setFormOffset(null);
          setFormState("fixed");
        }
        return;
      }

      // Reset to default at the top of the page
      if (window.scrollY <= 400) {
        if (formState !== "default") {
          setFormOffset(null);
          setFormState("default");
        }
        return;
      }

      // Ensure fixed state when scrolling up from bottom
      if (formState === "bottom" && window.scrollY > 400 && formRect.top > 32) {
        setFormOffset(null);
        setFormState("fixed");
      }
    };

    const onScroll = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [formState, isLargeScreen]);

  const formStyles = {
    fixed: "fixed top-32 right-11 w-96 z-10",
    bottom: "absolute right-11 w-96",
    default: "relative w-full max-w-md mx-auto",
    smallScreen: "relative w-full max-w-md mx-auto",
  };

  const dynamicStyle =
    isLargeScreen && formState === "bottom" && formOffset !== null
      ? { top: `${formOffset}px` }
      : isLargeScreen && formState === "fixed"
        ? { top: "8rem", right: "2.75rem" }
        : {};

  return (
    <div
      ref={formRef}
      className={`${
        isLargeScreen ? formStyles[formState] : formStyles.smallScreen
      } max-h-[80vh] overflow-y-auto rounded-lg border border-[#DAA520] bg-[#F4F1ED] p-6 text-[#5D4037]`}
      style={dynamicStyle}
    >
      <h2 className="mb-2 text-center text-2xl font-bold text-[#8B4513]">
        Te llamamos
      </h2>
      <p className="mb-4 text-center text-sm">
        Déjanos tus datos y pronto estaremos en contacto.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Nombre *</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-[#DAA520] bg-white px-3 py-2 text-[#5D4037] outline-none"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Correo electrónico *</label>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[#DAA520] bg-white px-3 py-2 text-[#5D4037] outline-none"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Celular o Teléfono *</label>
          <input
            type="tel"
            placeholder="Número de contacto"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-[#DAA520] bg-white px-3 py-2 text-[#5D4037] outline-none"
            required
          />
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="form-checkbox mt-1 border-[#DAA520] text-[#DAA520] focus:ring-[#DAA520]"
            required
          />
          <label className="ml-2 text-xs">
            Acepto los{" "}
            <a href="#" className="text-[#DAA520] underline">
              términos y condiciones
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-[#DAA520] bg-[#DAA520] py-2 font-semibold text-[#8B4513]"
        >
          Contáctame
        </button>
      </form>
    </div>
  );
}
