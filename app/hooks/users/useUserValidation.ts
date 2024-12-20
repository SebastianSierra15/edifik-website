export const useUserValidation = (
  user: any
): (() => {
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
      genderError: !user.gender?.trim() ? "El género es obligatorio." : "",
      roleError: !user.roleName?.trim() ? "El rol es obligatorio." : "",
      membershipError: !user.MembershipName?.trim()
        ? "La membresía es obligatoria."
        : "",
    };
  };

  return validateFields;
};
