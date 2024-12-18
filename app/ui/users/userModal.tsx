import { useEffect } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { UserData, Role, Gender, MembershipSummary } from "@/lib/definitios";

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
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-premium-background dark:bg-premium-backgroundLight rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-premium-borderColor dark:border-premium-borderColorHover py-3 px-6">
          <h5 className="text-xl font-semibold text-premium-primary dark:text-premium-primaryLight">
            {user.id ? "Editar Usuario" : "Registrar Usuario"}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-premium-secondary dark:text-premium-textPrimary hover:text-premium-primary text-3xl"
          >
            &times;
          </button>
        </div>

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
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Género
              </label>
              <select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              >
                <option value="">Seleccione género</option>
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.name}>
                    {gender.name}
                  </option>
                ))}
              </select>
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
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              >
                <option value="">Seleccione rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Membresía
              </label>
              <select
                name="membershipName"
                value={user.membershipName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              >
                <option value="">Seleccione membresía</option>
                {memberships.map((membership) => (
                  <option key={membership.id} value={membership.name}>
                    {membership.name}
                  </option>
                ))}
              </select>
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
        <div className="flex justify-end p-4 border-t border-premium-borderColor dark:border-premium-borderColorHover">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-premium-textPlaceholder hover:bg-premium-borderColor dark:bg-premium-secondary dark:hover:bg-premium-secondaryLight text-white rounded-lg mr-2 hover:scale-105 transition transform duration-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="userForm"
            className="px-4 py-2 bg-premium-primary hover:bg-premium-primaryDark dark:bg-premium-primaryLight dark:hover:bg-premium-primaryDark text-white rounded-lg hover:scale-105 transition transform duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
