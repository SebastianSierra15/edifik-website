import { useBodyOverflow } from "@/src/hooks/ui";
import type { Permission, RoleWithPermissions } from "@/src/interfaces";
import {
  ModalHeader,
  ModalFooter,
  AdminFormInput,
  AdminFormSelect,
} from "@/src/components/shared";

interface RoleModalProps {
  show: boolean;
  flag: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  role: RoleWithPermissions;
  permissions: Permission[];
  errors: {
    nameError: string;
    permissionsError: string;
  };
}

export function RoleModal({
  show,
  flag,
  onClose,
  onSubmit,
  handleChange,
  role,
  permissions,
  errors,
}: RoleModalProps) {
  useBodyOverflow(show);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        <ModalHeader
          title={role.id ? "Editar Rol" : "Registrar Rol"}
          onClose={onClose}
        />

        <form
          id="roleForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[50vh] space-y-4 overflow-y-auto px-6 py-4"
        >
          <AdminFormInput
            label="Nombre del rol"
            type="text"
            name="name"
            value={role.name || ""}
            placeholder="Nombre del rol"
            maxLength={50}
            onChange={handleChange}
            error={errors.nameError}
            flag={flag}
          />

          <div>
            <label className="block text-sm font-medium text-premium-textPrimary dark:text-premium-textPrimary mb-2">
              Permisos actuales
            </label>

            <ul className="list-disc pl-5 text-premium-textSecondary dark:text-premium-textSecondary">
              {role.permissions && role.permissions.length > 0 ? (
                role.permissions.map((perm) => (
                  <li key={perm.id} className="mb-1">
                    {perm.name}
                  </li>
                ))
              ) : (
                <li className="italic text-gray-500">
                  No hay permisos asignados
                </li>
              )}
            </ul>
          </div>

          <AdminFormSelect
            label="Asignar permiso"
            name="addPermission"
            value=""
            options={(permissions ?? [])
              .filter(
                (perm) =>
                  !role.permissions?.some(
                    (assignedPerm) => assignedPerm.id === perm.id
                  )
              )
              .map((perm) => ({ id: perm.id, name: perm.name }))}
            onChange={handleChange}
            error={errors.permissionsError}
            flag={flag}
          />

          <AdminFormSelect
            label="Eliminar permiso"
            name="deletePermission"
            value=""
            options={role.permissions || []}
            onChange={handleChange}
            flag={flag}
          />
        </form>

        <ModalFooter onClose={onClose} formId="roleForm" />
      </div>
    </div>
  );
}
