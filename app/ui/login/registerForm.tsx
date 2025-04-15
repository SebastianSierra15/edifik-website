"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "../modals/home/formInput";
import FormDatePicker from "../modals/home/formDatePicker";

export default function RegisterForm() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!email) {
      setEmailError("El correo electrónico es obligatorio.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("El correo electrónico no es válido.");
      isValid = false;
    }

    if (isValid) {
      setStep(2);
    }
  };

  const handlePersonalDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFullNameError("");
    setLastNameError("");
    setBirthDateError("");
    setPhoneError("");

    let isValid = true;

    if (!fullName) {
      setFullNameError("El nombre es obligatorio.");
      isValid = false;
    }

    if (!lastName) {
      setLastNameError("El apellido es obligatorio.");
      isValid = false;
    }

    if (!birthDate) {
      setBirthDateError("La fecha de nacimiento es obligatoria.");
      isValid = false;
    }

    if (!phone) {
      setPhoneError("El número de teléfono es obligatorio.");
      isValid = false;
    }

    if (isValid) {
      setStep(3);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Debes confirmar tu contraseña.");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      isValid = false;
    }

    if (isValid) {
      router.push("/login");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            name="email"
            type="text"
            value={email}
            placeholder="tu-email@ejemplo.com"
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <button className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover">
            Continuar
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePersonalDataSubmit} className="space-y-4">
          <FormInput
            label="Nombres"
            name="fullName"
            placeholder="Nombres completos"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fullNameError}
          />

          <FormInput
            label="Apellidos"
            name="lastName"
            placeholder="Apellidos completos"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={lastNameError}
          />

          <FormDatePicker
            label="Fecha de Nacimiento"
            name="birthDate"
            value={birthDate ? new Date(birthDate) : null}
            onChange={(date) =>
              setBirthDate(date ? date.toISOString().split("T")[0] : "")
            }
            dateMax={
              new Date(
                new Date().getFullYear() - 18,
                new Date().getMonth(),
                new Date().getDate()
              )
            }
            dateMin={new Date(new Date().getFullYear() - 120, 0, 1)}
            error={birthDateError}
          />

          <FormInput
            label="Número de Teléfono"
            name="phone"
            placeholder="312 345 6789"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
          />

          <button className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover">
            Continuar
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormInput
            label="Contraseña"
            name="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />

          <FormInput
            label="Confirmar Contraseña"
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
          />

          <button className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover">
            Registrarse
          </button>
        </form>
      )}
    </div>
  );
}
