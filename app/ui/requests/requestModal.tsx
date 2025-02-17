import { useBodyOverflow } from "@/app/hooks/useBodyOverflow ";
import ModalHeader from "../modals/modalHeader";
import ModalFooter from "../modals/modalFooter";
import dynamic from "next/dynamic";

const FormTextArea = dynamic(() => import("@/app/ui/modals/formTextArea"), {
  ssr: false,
});
const FormSelect = dynamic(() => import("@/app/ui/modals/formSelect"), {
  ssr: false,
});

interface RequestModalProps {
  show: boolean;
  flag: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  message: string;
  actionType: "approve" | "reject" | "revision";
  setRequestAction: (action: "approve" | "reject" | "revision") => void;
  errors: {
    messageError: string;
    actionTypeError: string;
  };
}

export default function RequestModal({
  show,
  flag,
  onClose,
  onSubmit,
  handleChange,
  message,
  actionType,
  setRequestAction,
  errors,
}: RequestModalProps) {
  useBodyOverflow(show);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-lg bg-premium-background shadow-xl dark:bg-premium-backgroundLight">
        {/* Header */}
        <ModalHeader title="Responder Solicitud" onClose={onClose} />

        {/* Body */}
        <form
          id="requestForm"
          onSubmit={onSubmit}
          noValidate
          className="h-[50vh] space-y-4 overflow-y-auto px-6 py-4"
        >
          <FormSelect
            label="Estado de la Solicitud"
            name="requestStatus"
            value={actionType}
            onChange={(e) =>
              setRequestAction(
                e.target.value as "approve" | "reject" | "revision"
              )
            }
            options={[
              { id: "approve", name: "Aprobar" },
              { id: "reject", name: "Rechazar" },
              { id: "revision", name: "Enviar a Revisión" },
            ]}
            error={errors?.actionTypeError || ""}
            flag={flag}
          />

          <FormTextArea
            label="Mensaje de respuesta"
            name="responseMessage"
            value={message}
            placeholder="Escribe un mensaje"
            onChange={handleChange}
            rows={7}
            maxLength={500}
            error={errors.messageError}
          />
        </form>

        {/* Footer */}
        <ModalFooter onClose={onClose} formId="requestForm" />
      </div>
    </div>
  );
}
