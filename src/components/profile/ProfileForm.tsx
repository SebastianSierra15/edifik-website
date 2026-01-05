"use client";

import { useState, useEffect } from "react";
import type { UserProfile, Gender } from "@/src/interfaces";
import { updateProfileSchema } from "@/src/schemas/user";
import {
  ClientFormInput,
  ClientFormDatePicker,
  ClientFormSelect,
} from "@/src/components/shared";

interface ProfileFormProps {
  user: UserProfile;
  genders: Gender[];
  onSubmitRequest: (data: ProfileUpdateInput) => void;
}

interface ProfileUpdateInput {
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date | null;
  phoneNumber?: string;
  genderId?: number | null;
}

export function ProfileForm({
  user,
  genders,
  onSubmitRequest,
}: ProfileFormProps) {
  const [form, setForm] = useState<UserProfile>(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseBirthdate = (
    value: UserProfile["birthdate"] | string | null | undefined
  ): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) return parsed;
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
      if (match) {
        const [, day, month, year] = match;
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
    return null;
  };

  const isIdentityDocumentLocked =
    typeof user.identityDocument === "string" &&
    user.identityDocument.trim() !== "";
  const isBirthdateLocked = !!parseBirthdate(user.birthdate);

  useEffect(() => {
    const changed = JSON.stringify(form) !== JSON.stringify(user);
    setHasChanges(changed);
  }, [form, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = genders.find((g) => g.id.toString() === e.target.value);
    if (selected) setForm({ ...form, gender: selected });
    setErrors((prev) => {
      if (!prev.genderId) return prev;
      const next = { ...prev };
      delete next.genderId;
      return next;
    });
  };

  const handleBirthDate = (date: Date | null) => {
    setForm({ ...form, birthdate: date ?? undefined });
    setErrors((prev) => {
      if (!prev.birthdate) return prev;
      const next = { ...prev };
      delete next.birthdate;
      return next;
    });
  };

  const validate = (): boolean => {
    const parsedBirthdate = parseBirthdate(form.birthdate);
    const result = updateProfileSchema.safeParse({
      identityDocument: form.identityDocument,
      names: form.names ?? "",
      lastnames: form.lastnames ?? "",
      birthdate: parsedBirthdate,
      phoneNumber: form.phoneNumber ?? "",
      genderId: form.gender?.id ?? null,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field) {
        const fieldName = String(field);
        newErrors[fieldName] =
          fieldName === "birthdate"
            ? "Fecha de nacimiento no valida."
            : issue.message;
      }
    });
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const parsedBirthdate = parseBirthdate(form.birthdate);

    onSubmitRequest({
      identityDocument: form.identityDocument,
      names: form.names,
      lastnames: form.lastnames,
      birthdate: parsedBirthdate,
      phoneNumber: form.phoneNumber,
      genderId: form.gender?.id ?? null,
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
        isEdit={!isIdentityDocumentLocked}
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
        value={parseBirthdate(form.birthdate)}
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
        isEdit={!isBirthdateLocked}
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
