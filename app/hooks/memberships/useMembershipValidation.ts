export const useMembershipValidation = (
  updateMembership: any,
): (() => {
  nameError: string;
  benefitsError: string;
  discountThreeMonthsError: string;
  discountSixMonthsError: string;
  discountTwelveMonthsError: string;
  maxProjectsError: string;
}) => {
  const validateFields = () => {
    return {
      nameError: !updateMembership.name.trim()
        ? "El nombre es obligatorio."
        : "",
      benefitsError: !updateMembership.benefits.trim()
        ? "La descripción de los beneficios es obligatoria."
        : "",
      discountThreeMonthsError:
        updateMembership.discountThreeMonths > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "",
      discountSixMonthsError:
        updateMembership.discountSixMonths > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "",
      discountTwelveMonthsError:
        updateMembership.discountTwelveMonths > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "",
      maxProjectsError:
        updateMembership.maxProjects <= 0
          ? "Debe haber al menos 1 propiedad."
          : "",
    };
  };

  return validateFields;
};
