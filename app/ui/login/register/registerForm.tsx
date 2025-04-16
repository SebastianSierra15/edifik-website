"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckEmail } from "@/app/hooks/users/useCheckEmail";
import { useRegisterUser } from "@/app/hooks/auth/register/useRegisterUser";
import StepEmail from "./stepEmail";
import StepPersonalData from "./stepPersonalData";
import StepPassword from "./stepPassword";

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

  const { checkEmailExists } = useCheckEmail();

  const {
    registerUser,
    loading: registering,
    error: registerError,
  } = useRegisterUser();

  const handleEmailSubmit = async (e: React.FormEvent) => {
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

    if (!isValid) return;

    const existingUserId = await checkEmailExists(email);

    if (existingUserId) {
      setEmailError("Este correo ya está registrado.");
      return;
    }

    setStep(2);
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

    const phoneRegex = /^3\d{9}$/;

    if (!phone) {
      setPhoneError("El número de teléfono es obligatorio.");
      isValid = false;
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      setPhoneError("Número de teléfono no válido.");
      isValid = false;
    }

    if (isValid) {
      setStep(3);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    if (!isValid) return;

    const success = await registerUser({
      names: fullName,
      lastnames: lastName,
      birthdate: birthDate,
      email,
      phoneNumber: phone,
      password,
    });

    if (success) {
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={
        step === 1
          ? handleEmailSubmit
          : step === 2
            ? handlePersonalDataSubmit
            : handlePasswordSubmit
      }
      className="space-y-4"
    >
      {step === 1 && (
        <StepEmail email={email} setEmail={setEmail} emailError={emailError} />
      )}

      {step === 2 && (
        <StepPersonalData
          fullName={fullName}
          setFullName={setFullName}
          fullNameError={fullNameError}
          lastName={lastName}
          setLastName={setLastName}
          lastNameError={lastNameError}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          birthDateError={birthDateError}
          phone={phone}
          setPhone={setPhone}
          phoneError={phoneError}
        />
      )}

      {step === 3 && (
        <StepPassword
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPasswordError={confirmPasswordError}
        />
      )}

      <div className="flex justify-between gap-4">
        {step > 1 && (
          <button
            type="button"
            disabled={registering}
            onClick={() => setStep((prev) => prev - 1)}
            className="w-full bg-client-backgroundAlt rounded-lg p-3 text-client-text transition hover:bg-client-backgroundDark"
          >
            Atrás
          </button>
        )}

        <button
          type="submit"
          disabled={registering}
          className="w-full rounded-lg bg-client-accent p-3 text-white shadow-lg transition hover:bg-client-accentHover disabled:opacity-50"
        >
          {registering
            ? "Registrando..."
            : step === 3
              ? "Registrarse"
              : "Continuar"}
        </button>
      </div>
    </form>
  );
}
