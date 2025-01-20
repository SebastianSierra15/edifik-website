export const useRoleValidation = (
  role: any
): (() => {
  nameError: string;
  permissionsError: string;
}) => {
  const validateFields = () => {
    return {
      nameError: !role.name?.trim() ? "El nombre del rol es obligatorio." : "",
      permissionsError:
        !role.permissions || role.permissions.length === 0
          ? "El rol debe tener al menos un permiso asignado."
          : "",
    };
  };

  return validateFields;
};
