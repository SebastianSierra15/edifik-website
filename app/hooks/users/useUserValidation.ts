export const useUserValidation = (
  user: any,
): (() => {
  usernameError: string;
  namesError: string;
  lastnamesError: string;
  emailError: string;
  phoneNumberError: string;
  genderError: string;
  roleError: string;
  membershipError: string;
}) => {
  const validateFields = () => {
    return {
      usernameError: !user.username?.trim()
        ? "El nombre de usuario es obligatorio."
        : "",
      namesError: !user.names?.trim() ? "El nombre es obligatorio." : "",
      lastnamesError: !user.lastnames?.trim()
        ? "El apellido es obligatorio."
        : "",
      emailError: !user.email?.trim()
        ? "El correo electrónico es obligatorio."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
          ? "El correo electrónico no es válido."
          : "",
      phoneNumberError:
        user.phoneNumber && !/^\d{10}$/.test(user.phoneNumber)
          ? "El número de teléfono debe tener 10 dígitos."
          : "",
      genderError: !user.gender ? "El género es obligatorio." : "",
      roleError: !user.role ? "El rol es obligatorio." : "",
      membershipError: !user.membership ? "La membresía es obligatoria." : "",
    };
  };

  return validateFields;
};
