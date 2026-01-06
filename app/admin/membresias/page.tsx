"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import type { Header, Membership } from "@/src/interfaces";
import { Table, TableSkeleton } from "@/src/components/shared";
import { useMembershipsPage } from "@/src/hooks/memberships";

const MembershipModal = dynamic(
  () => import("@/src/components/admin").then((mod) => mod.MembershipModal),
  { ssr: false }
);

export default function MembershipsPage() {
  const {
    memberships,
    totalEntries,
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
  } = useMembershipsPage();

  const headers: Header<Membership>[] = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className="container mx-auto pb-10">
      <h1 className="mb-6 pb-5 text-center text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Gestión de Membresías
      </h1>

      {showSkeleton ? (
        <TableSkeleton />
      ) : (
        <Table
          data={memberships}
          headers={headers}
          totalEntries={totalEntries}
          entry="membresías"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          searchValue={searchTerm}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          onEditClick={handleEditClick}
        />
      )}

      {modalOpen && (
        <MembershipModal
          show={modalOpen}
          onClose={closeModal}
          onSubmit={handleConfirmUpdate}
          handleChange={handleChange}
          membership={membership}
          errors={errors}
        />
      )}
    </div>
  );
}
