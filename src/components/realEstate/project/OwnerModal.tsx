import { useBodyOverflow } from "@/src/hooks/ui";
import type { User } from "@/src/interfaces";
import { ModalHeader, AdminFormInput } from "@/src/components/shared";

interface OwnerModalProps {
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
}

export function OwnerModal({
  show,
  flag,
  onClose,
  onSubmit,
  handleChange,
  user,
}: OwnerModalProps) {
  useBodyOverflow(show);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        {/* Header */}
        <ModalHeader title="Datos del Propietario" onClose={onClose} />

        {/* Body */}
        <form
          id="userProjectForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[60vh] space-y-4 overflow-y-auto px-6 py-4"
        >
          <AdminFormInput
            label="Email"
            type="email"
            name="email"
            value={user.email || ""}
            placeholder="Correo electrónico"
            maxLength={190}
            onChange={handleChange}
            flag={flag}
            isEdit={false}
          />

          <AdminFormInput
            label="Nombres"
            type="text"
            name="names"
            value={user.names || ""}
            placeholder="Nombres del usuario"
            maxLength={150}
            onChange={handleChange}
            flag={flag}
            isEdit={false}
          />

          <AdminFormInput
            label="Apellidos"
            type="text"
            name="lastnames"
            value={user.lastnames || ""}
            placeholder="Apellidos del usuario"
            maxLength={150}
            onChange={handleChange}
            flag={flag}
            isEdit={false}
          />

          <AdminFormInput
            label="Teléfono"
            type="text"
            name="phoneNumber"
            value={user.phoneNumber || ""}
            placeholder="Número de teléfono"
            maxLength={45}
            onChange={handleChange}
            flag={flag}
            isEdit={false}
          />
        </form>

        <div className="flex justify-end border-t border-premium-borderColor p-4 dark:border-premium-borderColorHover">
          <button
            type="button"
            onClick={onClose}
            className="transform rounded-lg bg-premium-textPlaceholder px-4 py-2 text-white transition duration-300 hover:scale-105 hover:bg-premium-borderColor dark:bg-premium-secondary dark:hover:bg-premium-secondaryDark"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
