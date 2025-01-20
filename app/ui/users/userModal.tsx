import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import { UserData, Role, Gender, MembershipSummary } from "@/lib/definitios";
import ModalHeader from "../modals/modalHeader";
import ModalFooter from "../modals/modalFooter";
import dynamic from "next/dynamic";

const FormInput = dynamic(() => import("@/app/ui/modals/formInput"), {
  ssr: false,
});
const FormSelect = dynamic(() => import("@/app/ui/modals/formSelect"), {
  ssr: false,
});
const FormCheckbox = dynamic(() => import("@/app/ui/modals/formCheckbox"), {
  ssr: false,
});

interface UserModalProps {
  show: boolean;
  flag: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  user: UserData;
  roles: Role[];
  genders: Gender[];
  memberships: MembershipSummary[];
  errors: {
    usernameError: string;
    namesError: string;
    lastnamesError: string;
    emailError: string;
    phoneNumberError: string;
    genderError: string;
    roleError: string;
    membershipError: string;
  };
}

export default function UserModal({
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
          <FormInput
            label="Nombre de usuario"
            type="text"
            name="username"
            value={user.username || ""}
            placeholder="Nombre de usuario"
            onChange={handleChange}
            error={errors.usernameError}
            flag={flag}
          />

          <FormInput
            label="Nombres"
            type="text"
            name="names"
            value={user.names || ""}
            placeholder="Nombres del usuario"
            onChange={handleChange}
            error={errors.namesError}
            flag={flag}
          />

          <FormInput
            label="Apellidos"
            type="text"
            name="lastnames"
            value={user.lastnames || ""}
            placeholder="Apellidos del usuario"
            onChange={handleChange}
            error={errors.lastnamesError}
            flag={flag}
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={user.email || ""}
            placeholder="Correo electrónico"
            onChange={handleChange}
            error={errors.emailError}
            flag={flag}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Teléfono"
              type="text"
              name="phoneNumber"
              value={user.phoneNumber || ""}
              placeholder="Número de teléfono"
              onChange={handleChange}
              error={errors.phoneNumberError}
              flag={flag}
            />

            <FormSelect
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
            <FormSelect
              label="Rol"
              name="role.id"
              value={user.role?.id || ""}
              options={roles}
              onChange={handleChange}
              error={errors.roleError}
              flag={flag}
            />

            <FormSelect
              label="Membresía"
              name="membership.id"
              value={user.membership?.id || ""}
              options={memberships}
              onChange={handleChange}
              error={errors.membershipError}
              flag={flag}
            />
          </div>

          <FormCheckbox
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
