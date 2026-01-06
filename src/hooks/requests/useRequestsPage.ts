import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Request } from "@/src/interfaces";

import { useRequestApi } from "./useRequestApi";
import { useRequestValidation } from "./useRequestValidation";
import { useRequests } from "./useRequests";

type RequestAction = "approve" | "reject" | "revision";

type AlertState = {
  type: "success" | "error" | null;
  message: string;
  show: boolean;
};

const ACTION_LABELS: Record<
  RequestAction,
  { title: string; verb: string; result: string }
> = {
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

export function useRequestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState(false);
  const [requestAction, setRequestAction] =
    useState<RequestAction>("approve");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [flag, setFlag] = useState(true);
  const [message, setMessage] = useState("");

  const [alert, setAlert] = useState<AlertState>({
    type: null,
    message: "",
    show: false,
  });

  const { requests, totalEntries, isLoadingRequests } = useRequests(
    currentPage,
    entriesPerPage,
    searchTerm,
    refreshTrigger
  );

  const { errors, validateFields, validateField } = useRequestValidation();
  const { processRequest } = useRequestApi();

  const showSkeleton = !hasLoadedOnce && isLoadingRequests;

  useEffect(() => {
    if (!isLoadingRequests && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [hasLoadedOnce, isLoadingRequests]);

  const actionInfo = useMemo(
    () => ACTION_LABELS[requestAction] ?? ACTION_LABELS.approve,
    [requestAction]
  );

  const handleConfirmSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setFlag(false);

      const isValid = validateFields(message, requestAction);
      if (!isValid) return;

      setIsConfirmationModalOpen(true);
    },
    [message, requestAction, validateFields]
  );

  const handleCloseConfirmationModal = useCallback(() => {
    setIsConfirmationModalOpen(false);
    setFlag(true);
  }, []);

  const handleConfirmedAction = useCallback(async () => {
    if (!selectedRequest || !message.trim()) {
      return;
    }

    const success = await processRequest(
      selectedRequest.id,
      requestAction,
      message,
      selectedRequest.userEmail
    );

    setIsConfirmationModalOpen(false);
    setIsRequestModalOpen(false);
    setMessage("");

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
  }, [message, processRequest, requestAction, selectedRequest]);

  const openRequestModal = useCallback(
    (request: Request, action: RequestAction) => {
      setSelectedRequest(request);
      setRequestAction(action);
      setMessage("");
      setFlag(true);
      setIsRequestModalOpen(true);
    },
    []
  );

  const closeRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
    setMessage("");
  }, []);

  const handleMessageChange = useCallback(
    (value: string) => {
      setMessage(value);
      validateField("messageError", value);
    },
    [validateField]
  );

  const handleRequestActionChange = useCallback(
    (action: RequestAction) => {
      setRequestAction(action);
      validateField("actionTypeError", action);
      setFlag(false);
    },
    [validateField]
  );

  const goToNextPage = useCallback(
    () => setCurrentPage((prev) => prev + 1),
    []
  );

  const goToPreviousPage = useCallback(
    () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    []
  );

  const goToPage = useCallback((page: number) => setCurrentPage(page), []);

  const handleEntriesPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setEntriesPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
    []
  );

  const onSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const closeAlert = useCallback(() => {
    setAlert({ type: null, message: "", show: false });
  }, []);

  return {
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
  };
}