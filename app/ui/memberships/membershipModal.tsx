import dynamic from "next/dynamic";
import { Membership } from "@/lib/definitios";
import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import ModalHeader from "../modals/modalHeader";
import ModalFooter from "../modals/modalFooter";

const FormInput = dynamic(() => import("@/app/ui/modals/formInput"), {
  ssr: false,
});

interface MembershipModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        {/* Header */}
        <ModalHeader title={"Editar Membersía"} onClose={onClose} />

        {/* body */}
        <form
          id="membershipForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[60vh] space-y-4 overflow-y-auto px-6 py-4"
        >
          <FormInput
            label="Nombre"
            type="text"
            name="name"
            value={membership.name || ""}
            placeholder="Nombre de la membresía"
            onChange={handleChange}
            error={errors.nameError}
          />

          <FormInput
            label="Descripción"
            type="text"
            name="benefits"
            value={membership.benefits || ""}
            placeholder="Descripción de la membresía"
            onChange={handleChange}
            error={errors.benefitsError}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Precio"
              type="text"
              name="price"
              value={membership.price || ""}
              placeholder="Precio"
              onChange={handleChange}
            />

            <FormInput
              label="Propiedades destacados"
              type="number"
              name="projectsFeatured"
              value={membership.projectsFeatured || ""}
              placeholder="Cantidad de propiedades destacadas"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Cantidad máxima de propiedades"
              type="nmber"
              name="maxProjects"
              value={membership.maxProjects || ""}
              placeholder="Máximo de propiedades permitidas"
              onChange={handleChange}
            />

            <FormInput
              label="Descuento 3 meses (%)"
              type="nmber"
              name="discountThreeMonths"
              value={membership.discountThreeMonths || ""}
              placeholder="Descuento en %"
              onChange={handleChange}
            />

            <FormInput
              label="Descuento 6 meses (%)"
              type="nmber"
              name="discountSixMonths"
              value={membership.discountSixMonths || ""}
              placeholder="Descuento en %"
              onChange={handleChange}
            />

            <FormInput
              label="Descuento 12 meses (%)"
              type="nmber"
              name="discountTwelveMonths"
              value={membership.discountTwelveMonths || ""}
              placeholder="Descuento en %"
              onChange={handleChange}
            />
          </div>
        </form>

        {/* Footer */}
        <ModalFooter onClose={onClose} formId="membershipForm" />
      </div>
    </div>
  );
}
