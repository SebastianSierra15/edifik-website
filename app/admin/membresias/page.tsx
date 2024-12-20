"use client";

import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import Table from "@/app/ui/table";
import TableSkeleton from "@/app/ui/tableSkeleton";
import { Membership, Header } from "@/lib/definitios";
import { useMemberships } from "@/app/hooks/memberships/useMemberships";
import { useMembershipValidation } from "@/app/hooks/memberships/useMembershipValidation";

const MembershipModal = dynamic(
  () => import("@/app/ui/memberships/membershipModal"),
  { ssr: false }
);
const ModalConfirmation = dynamic(() => import("@/app/ui/modals/modalConfirmation"), {
  ssr: false,
});
const ModalAlert = dynamic(() => import("@/app/ui/modals/modalAlert"), { ssr: false });

export default function MembershipsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"edit" | null>(
    null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { memberships, totalEntries, isLoading } = useMemberships(
    currentPage,
    entriesPerPage,
    searchTerm,
    refreshTrigger
  );

  const [updateMembership, setUpdateMembership] = useState<Membership>({
    id: 0,
    name: "",
    benefits: "",
    price: 0,
    projectsFeatured: 0,
    maxProjects: 0,
    discountThreeMonths: 0,
    discountSixMonths: 0,
    discountTwelveMonths: 0,
  });

  const validateFields = useMembershipValidation(updateMembership);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => membership.id !== 1004);
  }, [memberships]);

  const handleEditClick = useCallback((membership: Membership) => {
    setUpdateMembership(membership);
    setModalOpen(true);
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handleConfirmUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFields();
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      setAlertMessage("Por favor, corrige los errores antes de continuar.");
      setShowAlert(true);
      return;
    }

    setConfirmationAction("edit");
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    try {
      if (confirmationAction === "edit") {
        await fetch("/api/memberships", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateMembership),
        });

        setRefreshTrigger((prev) => prev + 1);
      }
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      console.error("Error al procesar la acción:", error);
      setAlertMessage(
        "Hubo un error al actualizar la membresía. Por favor, inténtalo de nuevo."
      );
      setShowAlert(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUpdateMembership({
      ...updateMembership,
      [name]: name === "price" ? Number(value) || 0 : value,
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const headers: Header<Membership>[] = [
    { label: "Membresía", key: "name", type: "string" },
    { label: "Beneficios", key: "benefits", type: "string" },
    { label: "Precio", key: "price", type: "number" },
    { label: "Proyectos Destacados", key: "projectsFeatured", type: "number" },
    { label: "Max. Proyectos", key: "maxProjects", type: "number" },
    {
      label: "Descuento por 3 Meses",
      key: "discountThreeMonths",
      type: "number",
    },
    {
      label: "Descuento por 6 Meses",
      key: "discountSixMonths",
      type: "number",
    },
    {
      label: "Descuento por 12 Meses",
      key: "discountTwelveMonths",
      type: "number",
    },
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-premium-primary dark:text-premium-primaryLight pb-5">
        Gestión de Membresías
      </h1>

      {isLoading ? (
        <TableSkeleton rows={3} columns={headers.length + 1} />
      ) : (
        <Table
          data={filteredMemberships}
          headers={headers}
          totalEntries={totalEntries}
          entry="membresías"
          currentPage={currentPage}
          totalPages={Math.ceil(totalEntries / entriesPerPage)}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          canDelete={false}
          onEditClick={handleEditClick}
        />
      )}

      {modalOpen && (
        <MembershipModal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleConfirmUpdate}
          handleChange={handleChange}
          membership={updateMembership}
          errors={validateFields()}
        />
      )}

      {isConfirmationModalOpen && (
        <ModalConfirmation
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmedAction}
          title="Confirmar Acción"
          message="¿Estás seguro de que quieres actualizar esta membresía?"
          confirmLabel="Confirmar"
          cancelLabel="Cancelar"
        />
      )}

      {showAlert && (
        <ModalAlert
          title="Advertencia"
          message={alertMessage}
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
