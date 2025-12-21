"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Eye, Plus } from "lucide-react";

import type { Header, User } from "@/src/interfaces";
import { Table, TableSkeleton } from "@/src/components/shared";
import { useUsersPage } from "@/src/hooks/users";

const UserModal = dynamic(
  () => import("@/src/components/admin").then((mod) => mod.UserModal),
  { ssr: false }
);
const UserProjectsModal = dynamic(
  () => import("@/src/components/admin").then((mod) => mod.UserProjectsModal),
  { ssr: false }
);

export default function UsersPage() {
  const {
    users,
    totalEntries,
    showSkeleton,
    currentPage,
    entriesPerPage,
    searchTerm,
    modalOpen,
    tempUser,
    roles,
    genders,
    memberships,
    errors,
    flag,
    isUserProjectsModalOpen,
    userProjects,
    userProjectsTotalEntries,
    isLoadingUserProjects,
    openEditModal,
    openRegisterModal,
    closeModal,
    handleConfirmSubmit,
    handleChange,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleEntriesPerPageChange,
    onSearch,
    onClearSearch,
    openUserProjectsModal,
    closeUserProjectsModal,
    handleDeleteUserProject,
    handleEditUserProject,
  } = useUsersPage();

  const headers: Header<User>[] = useMemo(
    () => [
      { label: "Id", key: "id", type: "number" },
      { label: "Nombres", key: "names", type: "string" },
      { label: "Apellidos", key: "lastnames", type: "string" },
      { label: "Email", key: "email", type: "string" },
      { label: "Teléfono", key: "phoneNumber", type: "string" },
      { label: "Género", key: "gender.name", type: "string" },
      { label: "Estado", key: "state", type: "boolean" },
      { label: "Fecha de registro", key: "registrationDate", type: "date" },
      { label: "Última conexión", key: "lastLogin", type: "date" },
      { label: "Rol", key: "role.name", type: "string" },
      { label: "Membresía", key: "membership.name", type: "string" },
      { label: "Num. Propiedades", key: "totalProperties", type: "number" },
      { label: "Prov. autenticación", key: "provider", type: "string" },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        icon: Eye,
        title: "Ver Propiedades",
        className: "text-green-500 hover:text-green-600",
        onClick: (item: User) => openUserProjectsModal(item.id),
        shouldRender: (item: User) => (item.totalProperties ?? 0) > 0,
      },
    ],
    [openUserProjectsModal]
  );

  return (
    <div className="container mx-auto pb-10">
      <h1 className="mb-6 pb-5 text-center text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Gestión de Usuarios
      </h1>
      <div className="mb-4 flex justify-center px-4 md:justify-end">
        <button
          onClick={openRegisterModal}
          className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          <Plus className="mr-2 size-6" />
          <span>Registrar Usuario</span>
        </button>
      </div>

      {showSkeleton ? (
        <TableSkeleton />
      ) : (
        <Table
          data={users}
          headers={headers}
          totalEntries={totalEntries}
          entry="usuarios"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          searchValue={searchTerm}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          onEditClick={openEditModal}
          actions={actions}
        />
      )}

      {modalOpen && (
        <UserModal
          show={modalOpen}
          onClose={closeModal}
          onSubmit={handleConfirmSubmit}
          handleChange={handleChange}
          user={tempUser || {}}
          roles={roles}
          genders={genders}
          memberships={memberships}
          errors={errors}
          flag={flag}
        />
      )}

      {isUserProjectsModalOpen && (
        <UserProjectsModal
          show={isUserProjectsModalOpen}
          onClose={closeUserProjectsModal}
          projects={userProjects}
          isLoading={isLoadingUserProjects}
          totalEntries={userProjectsTotalEntries}
          onDeleteProject={handleDeleteUserProject}
          onEditProject={handleEditUserProject}
        />
      )}
    </div>
  );
}
