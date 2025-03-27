"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import ContactForm from "./contactForm";

export default function ContactFormSection() {
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
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
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

      const stopPosition = pageHeight - (800 + formHeight);

      if (footerRect.top <= windowHeight) {
        if (formState !== "bottom") {
          setFormOffset(stopPosition);
          setFormState("bottom");
        }
        return;
      }

      if (window.scrollY > 400 && formRect.top <= 32) {
        if (formState !== "fixed") {
          setFormOffset(null);
          setFormState("fixed");
        }
        return;
      }

      if (window.scrollY <= 400) {
        if (formState !== "default") {
          setFormOffset(null);
          setFormState("default");
        }
        return;
      }

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
      className={clsx(
        isLargeScreen ? formStyles[formState] : formStyles.smallScreen,
        "max-h-[80vh] overflow-y-auto rounded-lg border border-client-accent bg-[#F4F1ED] p-6"
      )}
      style={dynamicStyle}
    >
      <h2 className="mb-2 text-center text-2xl font-bold text-client-accent">
        Te llamamos
      </h2>

      <p className="mb-4 text-center text-sm text-client-primary">
        Déjanos tus datos y pronto estaremos en contacto.
      </p>

      <ContactForm />
    </div>
  );
}
