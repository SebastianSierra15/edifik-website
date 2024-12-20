"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { User, UserData, Header } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";
import Table from "@/app/ui/table";
import TableSkeleton from "@/app/ui/tableSkeleton";
import { useUsers } from "@/app/hooks/users/useUsers";
import { useUserValidation } from "@/app/hooks/users/useUserValidation";

const UserModal = dynamic(() => import("@/app/ui/users/userModal"), {
  ssr: false,
});
const ModalConfirmation = dynamic(
  () => import("@/app/ui/modals/modalConfirmation"),
  { ssr: false }
);
const FaPlus = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaPlus)
);

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [registerUser, setRegisterUser] = useState<UserData>({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "register" | "edit" | null
  >(null);

  const { users, roles, genders, memberships, totalEntries, isLoading } =
    useUsers(currentPage, entriesPerPage, searchTerm);

  const [errors, setErrors] = useState({
    namesError: "",
    lastnamesError: "",
    emailError: "",
    phoneNumberError: "",
    genderError: "",
    roleError: "",
    membershipError: "",
  });

  const resetErrors = () => {
    setErrors({
      namesError: "",
      lastnamesError: "",
      emailError: "",
      phoneNumberError: "",
      genderError: "",
      roleError: "",
      membershipError: "",
    });
  };

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const validateUser = useUserValidation(editUser || registerUser);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    setEditUser(null);
    setRegisterUser({});
    setModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    try {
      const endpoint = "/api/users";
      const method = confirmationAction === "edit" ? "PUT" : "POST";
      const body = confirmationAction === "edit" ? editUser : registerUser;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error en la acción: ${response.statusText}`);
      }

      setModalOpen(false);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error al procesar la acción:", error);
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateUser();
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    setConfirmationAction(editUser ? "edit" : "register");
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (editUser) {
      setEditUser((prev) => ({
        ...prev!,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    } else {
      setRegisterUser((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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

  const headers: Header<User>[] = [
    { label: "Id", key: "id", type: "number" },
    { label: "Username", key: "username", type: "string" },
    { label: "Nombres", key: "names", type: "string" },
    { label: "Apellidos", key: "lastnames", type: "string" },
    { label: "Email", key: "email", type: "string" },
    { label: "Teléfono", key: "phoneNumber", type: "string" },
    { label: "Género", key: "gender", type: "string" },
    { label: "Estado", key: "state", type: "boolean" },
    { label: "Fecha de registro", key: "registrationDate", type: "date" },
    { label: "Última conexión", key: "lastLogin", type: "date" },
    { label: "Rol", key: "roleName", type: "string" },
    { label: "Membresía", key: "membershipName", type: "string" },
    { label: "Prov. autenticación", key: "provider", type: "string" },
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-premium-primary dark:text-premium-primaryLight pb-5">
        Gestión de Usuarios
      </h1>

      <div className="flex justify-center md:justify-end mb-4 px-4">
        <button
          onClick={handleRegisterClick}
          className="flex items-center bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-md transition-colors whitespace-nowrap space-x-2"
        >
          <FaPlus className="mr-2" />
          <span>Registrar Usuario</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} columns={headers.length + 1} />
      ) : (
        <Table
          data={users}
          headers={headers}
          totalEntries={totalEntries}
          entry="usuarios"
          currentPage={currentPage}
          totalPages={Math.ceil(totalEntries / entriesPerPage)}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          canDelete={true}
          onEditClick={handleEditClick}
        />
      )}

      {modalOpen && (
        <UserModal
          show={modalOpen}
          onClose={() => {
            setModalOpen(false);
            resetErrors();
          }}
          onSubmit={handleConfirmSubmit}
          handleChange={handleChange}
          user={editUser || registerUser}
          roles={roles}
          genders={genders}
          memberships={memberships}
          errors={errors}
        />
      )}

      {isConfirmationModalOpen && (
        <ModalConfirmation
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmedAction}
          title="Confirmar Acción"
          message={`¿Estás seguro de que quieres ${
            confirmationAction === "edit" ? "editar" : "registrar"
          } este usuario?`}
          confirmLabel="Confirmar"
          cancelLabel="Cancelar"
        />
      )}
    </div>
  );
}
