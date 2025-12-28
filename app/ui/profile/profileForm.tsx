"use client";

import { useState, useEffect } from "react";
import { User, Gender } from "@/lib/definitios";
import {
  ClientFormInput,
  ClientFormDatePicker,
  ClientFormSelect,
} from "@/src/components/shared";

interface ProfileFormProps {
  user: User;
  genders: Gender[];
  onSubmitRequest: (data: Partial<User>) => void;
}

export default function ProfileForm({
  user,
  genders,
  onSubmitRequest,
}: ProfileFormProps) {
  const [form, setForm] = useState<User>(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const changed = JSON.stringify(form) !== JSON.stringify(user);
    setHasChanges(changed);
  }, [form, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = genders.find((g) => g.id.toString() === e.target.value);
    if (selected) setForm({ ...form, gender: selected });
  };

  const handleBirthDate = (date: Date | null) => {
    setForm({ ...form, birthdate: date ?? undefined });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.names) newErrors.names = "Este campo es obligatorio";
    if (!form.lastnames) newErrors.lastnames = "Este campo es obligatorio";

    const phoneRegex = /^3\d{9}$/;

    if (!form.phoneNumber) {
      newErrors.phoneNumber = "El número de teléfono es obligatorio.";
    } else if (!phoneRegex.test(form.phoneNumber.replace(/\s+/g, ""))) {
      newErrors.phoneNumber = "Número de teléfono no válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmitRequest({
      identityDocument: form.identityDocument,
      names: form.names,
      lastnames: form.lastnames,
      birthdate: form.birthdate,
      phoneNumber: form.phoneNumber,
      gender: {
        id: form.gender?.id || 0,
        name: form.gender?.name || "",
      },
    });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ClientFormInput
        label="Correo electrónico"
        name="email"
        value={form.email}
        placeholder="Email"
        type="email"
        onChange={handleChange}
        isEdit={false}
        isAccent={true}
      />

      <ClientFormInput
        label="Número de documento"
        name="identityDocument"
        value={form.identityDocument ?? ""}
        placeholder="Ej: 1234567890"
        type="text"
        onChange={handleChange}
        error={errors.identityDocument}
        flag
        isAccent={true}
      />

      <ClientFormInput
        label="Nombres"
        name="names"
        value={form.names ?? ""}
        placeholder="Tus nombres"
        type="text"
        onChange={handleChange}
        error={errors.names}
        isAccent={true}
      />

      <ClientFormInput
        label="Apellidos"
        name="lastnames"
        value={form.lastnames ?? ""}
        placeholder="Tus apellidos"
        type="text"
        onChange={handleChange}
        error={errors.lastnames}
        isAccent={true}
      />

      <ClientFormDatePicker
        label="Fecha de nacimiento"
        name="birthDate"
        value={form.birthdate ? new Date(form.birthdate) : null}
        onChange={handleBirthDate}
        dateMax={
          new Date(
            new Date().getFullYear() - 18,
            new Date().getMonth(),
            new Date().getDate()
          )
        }
        dateMin={new Date(new Date().getFullYear() - 120, 0, 1)}
        error={errors.birthdate}
        isAccent={true}
      />

      <ClientFormInput
        label="Número de teléfono"
        name="phoneNumber"
        value={form.phoneNumber ?? ""}
        placeholder="Ej: 3001234567"
        type="text"
        onChange={handleChange}
        error={errors.phoneNumber}
        isAccent={true}
      />

      <ClientFormSelect
        label="Género"
        name="gender"
        value={form.gender?.id ?? ""}
        options={genders.map((g) => ({ id: g.id, name: g.name }))}
        onChange={handleGenderChange}
        error={errors.gender}
        isAccent={true}
      />

      <div className="col-span-1 md:col-span-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasChanges}
          className="w-full rounded-md bg-client-accent text-white py-2 font-semibold hover:bg-client-accentHover transition disabled:opacity-50"
        >
          Actualizar datos
        </button>
      </div>
    </form>
  );
}
