import { useEffect } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Membership } from "@/lib/definitios";

interface MembershipModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  membership: Membership;
  errors: {
    nameError: string;
    benefitsError: string;
    discountThreeMonthsError: string;
    discountSixMonthsError: string;
    discountTwelveMonthsError: string;
    maxProjectsError: string;
  };
}

export default function MembershipModal({
  show,
  onClose,
  onSubmit,
  handleChange,
  membership,
  errors,
}: MembershipModalProps) {
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: "price",
        value: value ? value : "0",
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background dark:bg-backgroundLight rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderColor dark:border-borderColorHover py-3 px-6">
          <h5 className="text-xl font-semibold text-primary dark:text-primaryLight">
            Editar Membresía
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary dark:text-textPrimary hover:text-primary text-3xl"
          >
            &times;
          </button>
        </div>

        {/* body */}
        <form
          id="membershipForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[60vh] overflow-y-auto px-6 py-4 space-y-4"
        >
          <div>
            <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={membership.name}
              onChange={handleChange}
              placeholder="Nombre de la membresía"
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.nameError
                  ? "border-red-500 bg-red-50"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
            />
            {errors.nameError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.nameError}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
              Descripción
            </label>
            <textarea
              name="benefits"
              value={membership.benefits}
              onChange={handleChange}
              placeholder="Descripción de la membresía"
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary resize-none ${
                errors.benefitsError
                  ? "border-red-500 bg-red-50"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              rows={4}
            />
            {errors.benefitsError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.benefitsError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Precio
              </label>
              <input
                type="text"
                name="price"
                value={formatPrice(Number(membership.price))}
                onChange={handlePriceChange}
                placeholder="Precio"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Proyectos Destacados
              </label>
              <input
                type="number"
                name="projectsFeatured"
                min={0}
                value={membership.projectsFeatured}
                onChange={handleChange}
                placeholder="Cantidad de proyectos destacados"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Cantidad Máxima de Proyectos
              </label>
              <input
                type="number"
                name="maxProjects"
                min={0}
                value={membership.maxProjects}
                onChange={handleChange}
                placeholder="Máximo de proyectos permitidos"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Descuento 3 Meses (%)
              </label>
              <input
                type="number"
                name="discountThreeMonths"
                min={0}
                max={100}
                value={membership.discountThreeMonths}
                onChange={handleChange}
                placeholder="Descuento en %"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Descuento 6 Meses (%)
              </label>
              <input
                type="number"
                name="discountSixMonths"
                min={0}
                max={100}
                value={membership.discountSixMonths}
                onChange={handleChange}
                placeholder="Descuento en %"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-textPrimary">
                Descuento 12 Meses (%)
              </label>
              <input
                type="number"
                name="discountTwelveMonths"
                min={0}
                max={100}
                value={membership.discountTwelveMonths}
                onChange={handleChange}
                placeholder="Descuento en %"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-borderColor dark:border-borderColorHover">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-textPlaceholder hover:bg-borderColor dark:bg-secondary dark:hover:bg-secondaryLight text-white rounded-lg mr-2 hover:scale-105 transition transform duration-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="membershipForm"
            className="px-4 py-2 bg-primary hover:bg-primaryDark dark:bg-primaryLight dark:hover:bg-primaryDark text-white rounded-lg hover:scale-105 transition transform duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
