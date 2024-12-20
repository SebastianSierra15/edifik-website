import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import { UserData, Role, Gender, MembershipSummary } from "@/lib/definitios";
import ModalHeader from "../modals/modalHeader";
import ModalFooter from "../modals/modalFooter";

interface UserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  user: UserData;
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
    membershipError: string;
  };
}

export default function UserModal({
  show,
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
      <div className="bg-premium-background dark:bg-premium-backgroundLight rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
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
          className="h-[60vh] overflow-y-auto px-6 py-4 space-y-4"
        >
          <div>
            <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Nombres
            </label>
            <input
              type="text"
              name="names"
              value={user.names}
              onChange={handleChange}
              placeholder="Nombres del usuario"
              className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                errors.namesError
                  ? "border-red-500 bg-red-50"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
            />
            {errors.namesError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.namesError}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Apellidos
            </label>
            <input
              type="text"
              name="lastnames"
              value={user.lastnames}
              onChange={handleChange}
              placeholder="Apellidos del usuario"
              className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                errors.lastnamesError
                  ? "border-red-500 bg-red-50"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
            />
            {errors.lastnamesError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.lastnamesError}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                errors.emailError
                  ? "border-red-500 bg-red-50"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
            />
            {errors.emailError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.emailError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Teléfono
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                placeholder="Número de teléfono"
                className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                  errors.phoneNumberError
                    ? "border-red-500 bg-red-50"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
              />
              {errors.phoneNumberError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.phoneNumberError}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Género
              </label>
              <select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                  errors.genderError
                    ? "border-red-500 bg-red-50"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
              >
                <option value="">Seleccione género</option>
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.name}>
                    {gender.name}
                  </option>
                ))}
              </select>
              {errors.genderError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.genderError}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Rol
              </label>
              <select
                name="roleName"
                value={user.roleName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                  errors.roleError
                    ? "border-red-500 bg-red-50"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
              >
                <option value="">Seleccione rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.roleError}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Membresía
              </label>
              <select
                name="membershipName"
                value={user.membershipName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                  errors.membershipError
                    ? "border-red-500 bg-red-50"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
              >
                <option value="">Seleccione membresía</option>
                {memberships.map((membership) => (
                  <option key={membership.id} value={membership.name}>
                    {membership.name}
                  </option>
                ))}
              </select>
              {errors.membershipError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.membershipError}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-premium-textPrimary dark:text-premium-textPrimary">
              <input
                type="checkbox"
                name="state"
                checked={user.state}
                onChange={handleChange}
                className="rounded"
              />
              Activo
            </label>
          </div>
        </form>

        {/* Footer */}
        <ModalFooter onClose={onClose} formId="userForm" />
      </div>
    </div>
  );
}
