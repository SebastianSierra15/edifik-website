"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Eye, CheckCircle } from "lucide-react";

import type { Header, Request, StatusMapping } from "@/src/interfaces";
import { useRequestsPage } from "@/src/hooks/requests";
import {
  Alert,
  ModalConfirmation,
  Table,
  TableSkeleton,
} from "@/src/components/shared";

const RequestModal = dynamic(
  () => import("@/src/components/admin").then((mod) => mod.RequestModal),
  { ssr: false }
);

export default function RequestsPage() {
  const {
    requests,
    totalEntries,
    showSkeleton,
    currentPage,
    entriesPerPage,
    searchTerm,
    isRequestModalOpen,
    isConfirmationModalOpen,
    selectedRequest,
    requestAction,
    message,
    errors,
    flag,
    alert,
    actionInfo,
    openRequestModal,
    closeRequestModal,
    handleConfirmSubmit,
    handleMessageChange,
    handleRequestActionChange,
    handleCloseConfirmationModal,
    handleConfirmedAction,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleEntriesPerPageChange,
    onSearch,
    onClearSearch,
    closeAlert,
  } = useRequestsPage();

  const headers = useMemo<Header<Request>[]>(() => {
    const operationStatus: Record<string, StatusMapping> = {
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
    };

    const requestStatus: Record<string, StatusMapping> = {
      aprobado: {
        label: "Aprobado",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      rechazado: {
        label: "Rechazado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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
    };

    return [
      { label: "ID", key: "id", type: "number" },
      { label: "Fecha", key: "date", type: "date" },
      {
        label: "Operación",
        key: "operation",
        type: "status",
        statusMapping: operationStatus,
      },
      { label: "Mensaje", key: "responseMessage", type: "string" },
      { label: "Usuario", key: "userEmail", type: "string" },
      { label: "Propiedad", key: "projectName", type: "string" },
      {
        label: "Estado",
        key: "statusRequestName",
        type: "status",
        statusMapping: requestStatus,
      },
    ];
  }, []);

  const actions = useMemo(
    () => [
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
    ],
    [openRequestModal]
  );

  return (
    <div className="container mx-auto pb-10">
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
          searchValue={searchTerm}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          actions={actions}
        />
      )}

      {isRequestModalOpen && selectedRequest && (
        <RequestModal
          show={isRequestModalOpen}
          flag={flag}
          onClose={closeRequestModal}
          onSubmit={handleConfirmSubmit}
          handleChange={(e) => handleMessageChange(e.target.value)}
          message={message}
          actionType={requestAction}
          errors={errors}
          setRequestAction={handleRequestActionChange}
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

      {alert.show && alert.type && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
}
