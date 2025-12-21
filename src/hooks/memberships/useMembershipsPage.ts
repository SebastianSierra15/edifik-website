import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Membership } from "@/src/interfaces";
import { useAlert, useConfirmation } from "@/src/providers";

import { useMembershipApi } from "./useMembershipApi";
import { useMembershipValidation } from "./useMembershipValidation";
import { useMemberships } from "./useMemberships";

const emptyMembership: Membership = {
  id: 0,
  name: "",
  benefits: "",
  price: 0,
  projectsFeatured: 0,
  maxProjects: 0,
  discountThreeMonths: 0,
  discountSixMonths: 0,
  discountTwelveMonths: 0,
};

export function useMembershipsPage() {
  const { showAlert } = useAlert();
  const confirm = useConfirmation();

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [membership, setMembership] = useState<Membership>(emptyMembership);

  const { memberships, totalEntries, isLoading } = useMemberships(
    currentPage,
    entriesPerPage,
    searchTerm,
    refreshTrigger
  );

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasLoadedOnce]);

  const showSkeleton = !hasLoadedOnce && isLoading;

  const { errors, validateFields } = useMembershipValidation(membership, true);
  const { updateMembership, error } = useMembershipApi();

  const { filteredMemberships, adjustedTotalEntries } = useMemo(() => {
    const filtered = memberships.filter((item) => item.id !== 1004);
    const removedCount = memberships.length - filtered.length;
    const adjustedTotal = Math.max(totalEntries - removedCount, 0);

    return {
      filteredMemberships: filtered,
      adjustedTotalEntries: adjustedTotal,
    };
  }, [memberships, totalEntries]);

  const handleEditClick = useCallback((selected: Membership) => {
    setMembership(selected);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleConfirmUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const isValid = await validateFields();

      if (!isValid) {
        return;
      }

      const accepted = await confirm({
        title: "Confirmar Acción",
        message: "¿Estás seguro de que quieres actualizar esta membresía?",
      });

      if (!accepted) {
        return;
      }

      const success = await updateMembership(membership);

      if (!success) {
        showAlert({
          type: "error",
          message: error ?? "Lo sentimos, algo salió mal, inténtalo más tarde.",
        });
        return;
      }

      setRefreshTrigger((prev) => prev + 1);
      setModalOpen(false);

      showAlert({
        type: "success",
        message: "Membresía editada correctamente.",
      });
    },
    [confirm, error, membership, showAlert, updateMembership, validateFields]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setMembership((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) || 0 : value,
      }));
    },
    []
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

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

  return {
    memberships: filteredMemberships,
    totalEntries: adjustedTotalEntries,
    isLoading,
    showSkeleton,
    modalOpen,
    membership,
    errors,
    currentPage,
    entriesPerPage,
    searchTerm,
    handleEditClick,
    closeModal,
    handleConfirmUpdate,
    handleChange,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleEntriesPerPageChange,
    onSearch,
    onClearSearch,
  };
}
