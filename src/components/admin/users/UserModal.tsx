"use client";

import type { Gender, MembershipSummary, Role, User } from "@/src/interfaces";
import { useBodyOverflow } from "@/src/hooks/ui";
import {
  ModalFooter,
  ModalHeader,
  AdminFormInput,
  AdminFormSelect,
  AdminFormCheckbox,
} from "@/src/components/shared";

interface UserModalProps {
  show: boolean;
  flag: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  user: Partial<User>;
  roles: Role[];
  genders: Gender[];
  memberships: MembershipSummary[];
  errors: {
    namesError: string;
    lastnamesError: string;
    emailError: string;
    phoneNumberError: string;
    genderError: string;
    roleError: string;
    membershipError?: string;
  };
}

export function UserModal({
  show,
  flag,
  onClose,
  onSubmit,
  handleChange,
  user,
  roles,
  genders,
  memberships,
  errors,
}: UserModalProps) {
  useBodyOverflow(show);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        {/* Header */}
        <ModalHeader
          title={user.id ? "Editar Usuario" : "Registrar Usuario"}
          onClose={onClose}
        />

        {/* Body */}
        <form
          id="userForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[60vh] space-y-4 overflow-y-auto px-6 py-4"
        >
          <AdminFormInput
            label="Nombres"
            type="text"
            name="names"
            value={user.names || ""}
            placeholder="Nombres del usuario"
            maxLength={150}
            onChange={handleChange}
            error={errors.namesError}
            flag={flag}
          />

          <AdminFormInput
            label="Apellidos"
            type="text"
            name="lastnames"
            value={user.lastnames || ""}
            placeholder="Apellidos del usuario"
            maxLength={150}
            onChange={handleChange}
            error={errors.lastnamesError}
            flag={flag}
          />

          <AdminFormInput
            label="Email"
            type="email"
            name="email"
            value={user.email || ""}
            placeholder="Correo electrónico"
            maxLength={190}
            onChange={handleChange}
            error={errors.emailError}
            flag={flag}
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminFormInput
              label="Teléfono"
              type="text"
              name="phoneNumber"
              value={user.phoneNumber || ""}
              placeholder="Número de teléfono"
              maxLength={45}
              onChange={handleChange}
              error={errors.phoneNumberError}
              flag={flag}
            />

            <AdminFormSelect
              label="Género"
              name="gender.id"
              value={user.gender?.id || ""}
              options={genders}
              onChange={handleChange}
              error={errors.genderError}
              flag={flag}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminFormSelect
              label="Rol"
              name="role.id"
              value={user.role?.id || ""}
              options={roles}
              onChange={handleChange}
              error={errors.roleError}
              flag={flag}
            />

            <AdminFormSelect
              label="Membresía"
              name="membership.id"
              value={user.membership?.id || ""}
              options={memberships}
              onChange={handleChange}
              showPlaceholder={false}
              flag={flag}
            />
          </div>

          <AdminFormCheckbox
            label="Activo"
            name="state"
            checked={user.state || false}
            onChange={handleChange}
            className="rounded"
          />
        </form>

        {/* Footer */}
        <ModalFooter onClose={onClose} formId="userForm" />
      </div>
    </div>
  );
}
