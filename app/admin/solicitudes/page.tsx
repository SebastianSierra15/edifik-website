"use client";

import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Eye, CheckCircle } from "lucide-react";
import { Request, Header } from "@/lib/definitios";
import { useRequests } from "@/app/hooks/requests/useRequests";
import { useRequestApi } from "@/app/hooks/requests/useRequestApi";
import { useRequestValidation } from "@/app/hooks/requests/useRequestValidation";
import Table from "@/app/ui/admin/table/table";
import TableSkeleton from "@/app/ui/skeletons/admin/tableSkeleton";
import RequestModal from "@/app/ui/admin/requests/requestModal";
import ModalConfirmation from "@/app/ui/modals/admin/modalConfirmation";
import Alert from "@/app/ui/alert";

export default function RequestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [requestAction, setRequestAction] = useState<
    "approve" | "reject" | "revision"
  >(() => "approve");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { requests, totalEntries, isLoadingRequests } = useRequests(
    currentPage,
    entriesPerPage,
    searchTerm,
    refreshTrigger
  );

  const { errors, validateFields, validateField } = useRequestValidation();
  const [flag, setFlag] = useState(true);
  const [message, setMessage] = useState("");

  const showSkeleton = !hasLoadedOnce && isLoadingRequests;
  if (!isLoadingRequests && !hasLoadedOnce) {
    setHasLoadedOnce(true);
  }

  const [alert, setAlert] = useState({
    type: "" as "success" | "error" | null,
    message: "",
    show: false,
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const { processRequest } = useRequestApi();

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlag(false);

    const isValid = validateFields(message, requestAction);
    if (!isValid) return;

    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setFlag(true);
  };

  const handleConfirmedAction = async () => {
    if (!selectedRequest || !message.trim() || !requestAction) {
      return;
    }

    const success = await processRequest(
      selectedRequest.id,
      requestAction,
      message,
      selectedRequest.userEmail
    );

    closeConfirmationModal();
    closeRequestModal();

    if (success) {
      setAlert({
        type: "success",
        message: `Solicitud ${
          requestAction === "approve"
            ? "aprobada"
            : requestAction === "reject"
              ? "rechazada"
              : "enviada a revisión"
        } correctamente.`,
        show: true,
      });

      setRefreshTrigger((prev) => prev + 1);
    } else {
      setAlert({
        type: "error",
        message: "Hubo un error al procesar la solicitud.",
        show: true,
      });
    }
  };

  const openRequestModal = (
    request: Request,
    action: "approve" | "reject" | "revision"
  ) => {
    setSelectedRequest(request);
    setRequestAction(action);
    setMessage("");
    setFlag(true);
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setMessage("");
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const goToNextPage = useCallback(
    () => setCurrentPage((prev) => prev + 1),
    []
  );

  const goToPreviousPage = useCallback(
    () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    []
  );

  const goToPage = useCallback((page: number) => setCurrentPage(page), []);

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const headers: Header<Request>[] = [
    { label: "ID", key: "id", type: "number" },
    { label: "Fecha", key: "date", type: "date" },
    {
      label: "Operación",
      key: "operation",
      type: "status",
      statusMapping: {
        agregar: {
          label: "Agregar",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        editar: {
          label: "Editar",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
      },
    },
    { label: "Mensaje", key: "responseMessage", type: "string" },
    { label: "Usuario", key: "userEmail", type: "string" },
    { label: "Propiedad", key: "projectName", type: "string" },
    {
      label: "Estado",
      key: "statusRequestName",
      type: "status",
      statusMapping: {
        aprobado: {
          label: "Aprobado",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        rechazado: {
          label: "Rechazado",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        },
        pendiente: {
          label: "Pendiente",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        revision: {
          label: "Revisión",
          className:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        },
      },
    },
  ];

  const actions = [
    {
      icon: Eye,
      title: "Ver Propiedad",
      className: "text-green-500 hover:text-green-600",
      redirectUrl: (item: Request) => `/admin/solicitudes/${item.projectId}`,
      openInNewTab: false,
    },
    {
      icon: CheckCircle,
      title: "Responder Solicitud",
      className: "text-blue-500 hover:text-blue-600",
      onClick: (item: Request) => openRequestModal(item, "approve"),
      shouldRender: (item: Request) =>
        item.statusRequestName.toLowerCase() === "pendiente",
    },
  ];

  const actionLabels = {
    approve: {
      title: "Confirmar Aprobación",
      verb: "aprobar",
      result: "aprobada",
    },
    reject: {
      title: "Confirmar Rechazo",
      verb: "rechazar",
      result: "rechazada",
    },
    revision: {
      title: "Confirmar Envío a Revisión",
      verb: "enviar a revisión",
      result: "en revisión",
    },
  };

  const actionInfo = actionLabels[requestAction] ?? actionLabels["approve"];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="mb-6 pb-5 text-center text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Gestión de Solicitudes
      </h1>

      {showSkeleton ? (
        <TableSkeleton />
      ) : (
        <Table<Request>
          data={requests}
          headers={headers}
          totalEntries={totalEntries}
          entry="solicitudes"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          actions={actions}
        />
      )}

      {isRequestModalOpen && selectedRequest && (
        <RequestModal
          show={isRequestModalOpen}
          flag={flag}
          onClose={closeRequestModal}
          onSubmit={handleConfirmSubmit}
          handleChange={(e) => {
            setMessage(e.target.value);
            validateField("messageError", e.target.value);
          }}
          message={message}
          actionType={requestAction}
          errors={errors}
          setRequestAction={(action) => {
            setRequestAction(action);
            validateField("actionTypeError", action);
            setFlag(false);
          }}
        />
      )}

      {isConfirmationModalOpen && selectedRequest && (
        <ModalConfirmation
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmedAction}
          title={actionInfo.title}
          message={`¿Estás seguro de que deseas ${actionInfo.verb} esta solicitud? Una vez ${actionInfo.result}, no se podrá modificar la respuesta.`}
          confirmLabel={
            actionInfo.verb.charAt(0).toUpperCase() + actionInfo.verb.slice(1)
          }
          cancelLabel="Cancelar"
        />
      )}

      {alert.show && (
        <Alert
          type={alert.type!}
          message={alert.message}
          onClose={() => setAlert({ type: null, message: "", show: false })}
        />
      )}
    </div>
  );
}
