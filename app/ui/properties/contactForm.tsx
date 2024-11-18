import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", { name, email, phone });
  };

  return (
    <div
      className="w-full p-6 shadow-lg rounded-lg"
      style={{
        backgroundColor: "#8B4513", // Marrón Tierra
        color: "#FFFFFF", // Blanco para el texto
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: "#DAA520" }}
      >
        Te llamamos
      </h2>
      <p className="text-sm text-center mb-4" style={{ color: "#FFFFFF" }}>
        Déjanos tus datos y pronto estaremos en contacto.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#EDEDED" }}>
            Nombre *
          </label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md outline-none"
            style={{
              color: "#5D4037", // Marrón Oscuro para el texto de entrada
              backgroundColor: "#FFFFFF",
              border: "2px solid #DAA520", // Borde dorado claro
            }}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#EDEDED" }}>
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
              border: "2px solid #DAA520",
            }}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1" style={{ color: "#EDEDED" }}>
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
              border: "2px solid #DAA520",
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
          <label className="ml-2 text-xs" style={{ color: "#EDEDED" }}>
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
          className="w-full py-2 rounded-md font-semibold transition duration-300"
          style={{
            backgroundColor: "#DAA520",
            color: "#8B4513",
            border: "2px solid #DAA520",
          }}
        >
          Contáctame
        </button>
      </form>
    </div>
  );
}
