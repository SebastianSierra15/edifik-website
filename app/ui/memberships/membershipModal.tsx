import dynamic from "next/dynamic";
import { Membership } from "@/lib/definitios";
import { formatNumber } from "@/utils/formatters";
import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import ModalHeader from "../modals/modalHeader";
import ModalFooter from "../modals/modalFooter";

const AiOutlineExclamationCircle = dynamic(() =>
  import("react-icons/ai").then((mod) => mod.AiOutlineExclamationCircle)
);

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
  useBodyOverflow(show);

  if (!show) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: "price",
        value: value || "0",
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-premium-background dark:bg-premium-backgroundLight rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <ModalHeader title={"Editar Membersía"} onClose={onClose} />

        {/* body */}
        <form
          id="membershipForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[60vh] overflow-y-auto px-6 py-4 space-y-4"
        >
          <div>
            <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={membership.name}
              onChange={handleChange}
              placeholder="Nombre de la membresía"
              className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary ${
                errors.nameError
                  ? "border-red-500 bg-red-50"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
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
            <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Descripción
            </label>
            <textarea
              name="benefits"
              value={membership.benefits}
              onChange={handleChange}
              placeholder="Descripción de la membresía"
              className={`w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary resize-none ${
                errors.benefitsError
                  ? "border-red-500 bg-red-50"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
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
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Precio
              </label>
              <input
                type="text"
                name="price"
                value={formatNumber(Number(membership.price))}
                onChange={handlePriceChange}
                placeholder="Precio"
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Proyectos Destacados
              </label>
              <input
                type="number"
                name="projectsFeatured"
                min={0}
                value={membership.projectsFeatured}
                onChange={handleChange}
                placeholder="Cantidad de proyectos destacados"
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Cantidad Máxima de Proyectos
              </label>
              <input
                type="number"
                name="maxProjects"
                min={0}
                value={membership.maxProjects}
                onChange={handleChange}
                placeholder="Máximo de proyectos permitidos"
                className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
              />
            </div>

            {[
              "discountThreeMonths",
              "discountSixMonths",
              "discountTwelveMonths",
            ].map((field, idx) => (
              <div key={idx}>
                <label className="text-sm font-medium mb-2 text-premium-textPrimary dark:text-premium-textPrimary">
                  Descuento {idx === 0 ? "3" : idx === 1 ? "6" : "12"} Meses (%)
                </label>
                <input
                  type="number"
                  name={field}
                  min={0}
                  max={100}
                  value={(membership as any)[field]}
                  onChange={handleChange}
                  placeholder="Descuento en %"
                  className="w-full px-3 py-2 border rounded-md bg-premium-background dark:bg-premium-backgroundLight text-premium-textPrimary dark:text-premium-textPrimary border-premium-borderColor dark:border-premium-borderColorHover"
                />
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <ModalFooter onClose={onClose} formId="membershipForm" />
      </div>
    </div>
  );
}
