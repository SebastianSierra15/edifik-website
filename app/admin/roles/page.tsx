"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";

import { useRolesPage } from "@/src/hooks/roles";

import { Table, TableSkeleton } from "@/src/components/shared";

const RoleModal = dynamic(
  () => import("@/src/components/admin").then((mod) => mod.RoleModal),
  { ssr: false }
);

export default function RolesPage() {
  const {
    roles,
    totalEntries,
    loading,
    permissions,
    errors,
    flag,
    activeRole,
    modalOpen,
    currentPage,
    entriesPerPage,
    searchTerm,
    openCreate,
    openEdit,
    openDelete,
    closeModal,
    handleConfirmSubmit,
    handleChange,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleEntriesPerPageChange,
    onSearch,
    onClearSearch,
  } = useRolesPage();

  // headers (mantengo tu Table actual)
  const headers = useMemo(
    () => [
      { label: "Id", key: "id", type: "number" },
      { label: "Nombre", key: "name", type: "string" },
      { label: "Permisos", key: "permissions", type: "array", subKey: "name" },
    ],
    []
  );

  return (
    <div className="container mx-auto pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-premium-primary dark:text-premium-primaryLight pb-5">
        Gestión de Roles
      </h1>

      <div className="mb-4 flex justify-center px-4 md:justify-end">
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          <Plus className="mr-2 size-6" />
          <span>Registrar Rol</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Table
          data={roles}
          headers={headers as any}
          totalEntries={totalEntries}
          entry="roles"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          searchValue={searchTerm}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          onEditClick={openEdit}
          onDeleteClick={openDelete}
        />
      )}

      {modalOpen && (
        <RoleModal
          show={modalOpen}
          onClose={closeModal}
          onSubmit={handleConfirmSubmit}
          handleChange={handleChange}
          role={activeRole}
          permissions={permissions}
          errors={errors}
          flag={flag}
        />
      )}
    </div>
  );
}
