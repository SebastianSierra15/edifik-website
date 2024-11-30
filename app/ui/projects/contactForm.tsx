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
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", { name, email, phone });
  };

  useEffect(() => {
    const handleScroll = () => {
      const isLargeScreen = window.innerWidth >= 1024;

      if (!isLargeScreen) {
        setFormState("default");
        return;
      }

      const formTop = formRef.current?.getBoundingClientRect().top || 0;
      const formHeight = formRef.current?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 200) {
        setFormState("bottom");
      } else if (formTop <= windowHeight - formHeight && window.scrollY > 400) {
        setFormState("fixed");
      } else {
        setFormState("default");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formHeight = formRef.current?.offsetHeight || 0;
  const dynamicMarginTop =
    formState === "bottom" ? `calc(100vh - ${formHeight}px - 200px)` : "0px";

  const formClasses = {
    fixed: "lg:fixed lg:top-32 lg:right-11 lg:z-10 lg:w-96",
    bottom: `relative w-full max-w-md mx-auto lg:mt-[${dynamicMarginTop}] lg:w-96`,
    default: "relative w-full max-w-md mx-auto lg:w-96",
  };

  return (
    <div
      ref={formRef}
      className={`p-6 rounded-lg transition-all duration-300 ${formClasses[formState]}`}
      style={{
        backgroundColor: "#F4F1ED",
        color: "#5D4037",
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #DAA520",
      }}
    >
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: "#8B4513" }}
      >
        Te llamamos
      </h2>
      <p className="text-sm text-center mb-4" style={{ color: "#5D4037" }}>
        Déjanos tus datos y pronto estaremos en contacto.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#5D4037" }}>
            Nombre *
          </label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md outline-none"
            style={{
              color: "#5D4037",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DAA520",
            }}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#5D4037" }}>
            Correo electrónico *
          </label>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md outline-none"
            style={{
              color: "#5D4037",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DAA520",
            }}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#5D4037" }}>
            Celular o Teléfono *
          </label>
          <input
            type="tel"
            placeholder="Número de contacto"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-md outline-none"
            style={{
              color: "#5D4037",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DAA520",
            }}
            required
          />
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="form-checkbox mt-1"
            style={{ borderColor: "#DAA520", accentColor: "#DAA520" }}
            required
          />
          <label className="ml-2 text-xs" style={{ color: "#5D4037" }}>
            Acepto los{" "}
            <a
              href="#"
              style={{ color: "#DAA520", textDecoration: "underline" }}
            >
              términos y condiciones
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold transition-transform duration-300 transform hover:scale-105"
          style={{
            backgroundColor: "#DAA520",
            color: "#8B4513",
            border: "1px solid #DAA520",
          }}
        >
          Contáctame
        </button>
      </form>
    </div>
  );
}
