"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDebouncedCallback } from "use-debounce";
import { useCallback } from "react";
import { Membership, Header } from "@/lib/definitios";
import { useMemberships } from "@/app/hooks/memberships/useMemberships";
import { useMembershipValidation } from "@/app/hooks/memberships/useMembershipValidation";
import { useMembershipUpdate } from "@/app/hooks/memberships/useMembershipUpdate";
import Alert from "@/app/ui/alert";
import Table from "@/app/ui/table/table";
import TableSkeleton from "@/app/ui/skeletons/tableSkeleton";
import ModalConfirmation from "@/app/ui/modals/modalConfirmation";

const MembershipModal = dynamic(
  () => import("@/app/ui/memberships/membershipModal"),
  { ssr: false }
);

export default function MembershipsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    type: "" as "success" | "error" | null,
    message: "",
    show: false,
  });

  const { memberships, totalEntries, isLoading } = useMemberships(
    currentPage,
    entriesPerPage,
    searchTerm,
    refreshTrigger
  );

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const showSkeleton = !hasLoadedOnce && isLoading;
  if (!isLoading && !hasLoadedOnce) {
    setHasLoadedOnce(true);
  }

  const [membership, setMembership] = useState<Membership>({
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

  const { errors, validateFields } = useMembershipValidation(membership, true);

  const { updateMembership } = useMembershipUpdate();

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => membership.id !== 1004);
  }, [memberships]);

  const handleEditClick = useCallback((membership: Membership) => {
    setMembership(membership);
    setModalOpen(true);
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handleConfirmUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateFields();

    if (!isValid) {
      return;
    }

    setIsConfirmationModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    const success = await updateMembership(membership);
    if (success) {
      setRefreshTrigger((prev) => prev + 1);
      setModalOpen(false);
      setIsConfirmationModalOpen(false);

      setAlert({
        type: "success",
        message: "Membresía editada correctamente.",
        show: true,
      });
    } else {
      setAlert({
        type: "error",
        message: "Lo sentimos, algo salió mal, intentalo más tarde.",
        show: true,
      });
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setMembership({
      ...membership,
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
    {
      label: "Propiedades Destacadas",
      key: "projectsFeatured",
      type: "number",
    },
    { label: "Max. Propiedades", key: "maxProjects", type: "number" },
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
      <h1 className="mb-6 pb-5 text-center text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Gestión de Membresías
      </h1>

      {showSkeleton ? (
        <TableSkeleton />
      ) : (
        <Table
          data={filteredMemberships}
          headers={headers}
          totalEntries={totalEntries}
          entry="membresías"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          onEditClick={handleEditClick}
        />
      )}

      {modalOpen && (
        <MembershipModal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleConfirmUpdate}
          handleChange={handleChange}
          membership={membership}
          errors={errors}
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
