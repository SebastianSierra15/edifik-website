"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  UserData,
  Role,
  Gender,
  MembershipSummary,
  Header,
} from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";
import Table from "@/app/ui/table";
import UserModal from "@/app/ui/users/userModal";
import ModalConfirmation from "@/app/ui/modalConfirmation";
import TableSkeleton from "@/app/ui/tableSkeleton";
import { FaPlus } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [memberships, setMemberships] = useState<MembershipSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [registerUser, setRegisterUser] = useState<UserData>({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "register" | "edit" | null
  >(null);

  const [errors, setErrors] = useState({
    namesError: "",
    roleError: "",
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/api/users?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${searchTerm}`
      );
      setUsers(response.data.users);
      setTotalEntries(response.data.totalEntries);
      setRoles(response.data.roles);
      setGenders(response.data.genders);
      setMemberships(response.data.memberships);
    } catch (error) {
      console.error("Error al recuperar los usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, entriesPerPage, searchTerm]);

  const validateFields = () => {
    const newErrors = { ...errors };

    const userToValidate = editUser || registerUser;

    if (!userToValidate.names) {
      newErrors.namesError = "El nombre es obligatorio.";
    }

    if (!userToValidate.roleName) {
      newErrors.roleError = "El rol es obligatorio.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const resetErrors = () => {
    setErrors({
      namesError: "",
      roleError: "",
    });
  };

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
      if (confirmationAction === "edit" && editUser) {
        await axios.put("/api/users", editUser);
      } else if (confirmationAction === "register") {
        await axios.post("/api/users", registerUser);
      }
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al procesar la acción:", error);
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

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

      <div className="px-4 lg:px-8 py-5 bg-premium-backgroundLight dark:bg-premium-secondaryLight rounded-3xl lg:mx-4 shadow-lg">
        {loading ? (
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
      </div>

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
        errors={{
          namesError: errors.namesError,
          lastnamesError: "",
          emailError: "",
          phoneNumberError: "",
          genderError: "",
        }}
      />

      <ModalConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmedAction}
        icon={
          <AiOutlineCheckCircle className="w-10 h-10 text-premium-primary" />
        }
        title="Confirmar Acción"
        message={`¿Estás seguro de que quieres ${
          confirmationAction === "edit" ? "editar" : "registrar"
        } este usuario?`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
