"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import ContactForm from "./contactForm";

interface ContactFormSectionProps {
  locationRef: React.RefObject<HTMLDivElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  propertyId: number;
  propertyName: string;
  toEmail: string;
  phoneNumber: string;
}

export default function ContactFormSection({
  locationRef,
  wrapperRef,
  propertyId,
  propertyName,
  toEmail,
  phoneNumber,
}: ContactFormSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [checked, setChecked] = useState(false);
  const [formState, setFormState] = useState<"fixed" | "bottom" | "default">(
    "default"
  );
  const [formHeight, setFormHeight] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^3\d{9}$/;
    const isPhoneValid = phoneRegex.test(phone.replace(/\s+/g, ""));

    const errors = {
      name: name.trim() ? "" : "El nombre es obligatorio.",
      phone: phone.trim()
        ? isPhoneValid
          ? ""
          : "Número de teléfono no válido."
        : "El teléfono es obligatorio.",
      email: email.trim()
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "El correo no es válido."
        : "El correo es obligatorio.",
    };

    if (Object.values(errors).some((e) => e !== "")) {
      alert(
        Object.values(errors)
          .filter((e) => e !== "")
          .join("\n")
      );
      return;
    }

    const message = `Hola, estoy interesado en la propiedad "${propertyName}" con ID: ${propertyId}.\n\nMe pueden contactar al correo: ${email}.`;
    const payload = { name, email, phone, message };

    try {
      setIsSubmitting(true);

      const res1 = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, toEmail }),
      });

      if (!res1.ok) {
        throw new Error("No se pudo enviar al destinatario principal.");
      }

      let enviadoEmpresa = true;

      if (toEmail !== process.env.NEXT_PUBLIC_COMPANY_EMAIL) {
        const res2 = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            toEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL!,
          }),
        });

        enviadoEmpresa = res2.ok;

        if (!enviadoEmpresa) {
          console.warn("⚠️ No se pudo enviar el correo a la empresa.");
        }
      }

      setIsSubmitting(false);
      setName("");
      setEmail("");
      setPhone("");

      if (enviadoEmpresa) {
        alert("✅ Mensaje enviado correctamente.");
      } else {
        alert(
          "✅ Mensaje enviado al destinatario, pero no se pudo notificar a la empresa."
        );
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("❌ Hubo un error al enviar el mensaje.");
    }
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
      const locationElement = locationRef.current;
      const wrapperElement = wrapperRef.current;

      if (!formElement || !locationElement || !wrapperElement) return;

      const scrollTop = window.scrollY;
      const wrapperTop = wrapperElement.offsetTop;
      const locationTop = locationElement.offsetTop;

      const breakPoint = locationTop - formElement.offsetHeight - 64;

      if (scrollTop >= breakPoint) {
        if (formState !== "bottom") {
          setFormState("bottom");
        }
        return;
      }

      if (scrollTop >= wrapperTop && scrollTop < breakPoint) {
        if (formState !== "fixed") {
          setFormHeight(formElement.offsetHeight);
          setFormState("fixed");
        }
        return;
      }

      if (scrollTop < wrapperTop) {
        if (formState !== "default") {
          setFormHeight(0);
          setFormState("default");
        }
        return;
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
    bottom: "absolute bottom-0 right-11 w-96 z-0",
    default: "relative w-80 sm:w-96 mx-auto",
  };

  return (
    <>
      {isLargeScreen && formState === "fixed" && (
        <div style={{ height: formHeight }} className="w-full" />
      )}

      <div
        ref={formRef}
        className={clsx(
          isLargeScreen ? formStyles[formState] : formStyles.default,
          "max-h-[80vh] overflow-y-auto rounded-lg border border-client-accent bg-[#F4F1ED] p-6"
        )}
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-client-accent">
          Te llamamos
        </h2>

        <p className="mb-4 text-center text-sm text-client-primary">
          Déjanos tus datos y pronto estaremos en contacto.
        </p>

        <ContactForm
          name={name}
          email={email}
          phone={phone}
          setName={setName}
          setEmail={setEmail}
          setPhone={setPhone}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-4 w-full rounded-md border py-2 font-semibold text-white bg-client-accentLight hover:bg-client-accentHover"
        >
          {isSubmitting ? "Enviando..." : "Contáctame"}
        </button>

        <Link
          href={`https://wa.me/57${phoneNumber.replace(
            /\D/g,
            ""
          )}?text=${encodeURIComponent(
            `Hola, estoy interesado en la propiedad "${propertyName}" con ID: ${propertyId}.`
          )}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-md border py-2 font-semibold text-white bg-green-500 hover:bg-green-600 transition"
        >
          Chatear por WhatsApp
        </Link>
      </div>
    </>
  );
}
