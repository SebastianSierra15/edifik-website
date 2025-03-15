"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Plus, Eye } from "lucide-react";
import { User, UserData, Header } from "@/lib/definitios";
import { useUsers } from "@/app/hooks/users/useUsers";
import { useUserValidation } from "@/app/hooks/users/useUserValidation";
import { useUserApi } from "@/app/hooks/users/useUserApi";
import { useUsersMetadata } from "@/app/hooks/users/useUsersMetadata";
import Table from "@/app/ui/admin/table/table";
import TableSkeleton from "@/app/ui/skeletons/admin/tableSkeleton";
import UserProjectsModal from "@/app/ui/admin/users/userProjectsModal ";
import ModalConfirmation from "@/app/ui/modals/admin/modalConfirmation";
import Alert from "@/app/ui/alert";

const UserModal = dynamic(() => import("@/app/ui/admin/users/userModal"), {
  ssr: false,
});

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [tempUser, setTempUser] = useState<UserData | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isUserProjectsModalOpen, setIsUserProjectsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<
    "register" | "edit" | null
  >(null);
  const [flag, setFlag] = useState(true);
  const [alert, setAlert] = useState({
    type: "" as "success" | "error" | null,
    message: "",
    show: false,
  });

  const { users, totalEntries, isLoadingUsers, refetchUsers } = useUsers(
    currentPage,
    entriesPerPage,
    searchTerm
  );
  const { roles, genders, memberships } = useUsersMetadata();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const showSkeleton = !hasLoadedOnce && isLoadingUsers;
  if (!isLoadingUsers && !hasLoadedOnce) {
    setHasLoadedOnce(true);
  }

  const { errors, validateFields } = useUserValidation(
    tempUser || {},
    !!editUser
  );

  const { submitUser } = useUserApi();

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => membership.id !== 1004);
  }, [memberships]);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setTempUser({ ...user });
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    setEditUser(null);
    setTempUser({});
    setModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    if (!tempUser) {
      return;
    }

    const success = await submitUser(tempUser, confirmationAction!);

    if (success) {
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      setFlag(true);

      if (confirmationAction === "edit") {
        setEditUser(tempUser);
      }

      await refetchUsers();

      setAlert({
        type: "success",
        message: `Usuario ${
          confirmationAction === "edit" ? "editado" : "registrado"
        } correctamente.`,
        show: true,
      });
    } else {
      setIsConfirmationModalOpen(false);
      setAlert({
        type: "error",
        message: "Lo sentimos, algo salió mal, inténtalo más tarde.",
        show: true,
      });
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlag(false);

    const isValid = await validateFields();

    if (!isValid) {
      return;
    }

    setConfirmationAction(editUser ? "edit" : "register");
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setFlag(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    const updateNestedValue = (obj: any, path: string, value: any) => {
      const keys = path.split(".");
      let current = obj;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      });

      return { ...obj };
    };

    setTempUser((prev) => {
      const updatedUser = updateNestedValue(prev || {}, name, newValue);
      return updatedUser;
    });
  };

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openUserProjectsModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsUserProjectsModalOpen(true);
  };

  const headers: Header<User>[] = [
    { label: "Id", key: "id", type: "number" },
    { label: "Username", key: "username", type: "string" },
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
  ];

  const actions = [
    {
      icon: Eye,
      title: "Ver Propiedades",
      className: "text-green-500 hover:text-green-600",
      onClick: (item: User) => openUserProjectsModal(item.id),
      shouldRender: (item: User) => (item.totalProperties ?? 0) > 0,
    },
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="mb-6 pb-5 text-center text-3xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Gestión de Usuarios
      </h1>
      <div className="mb-4 flex justify-center px-4 md:justify-end">
        <button
          onClick={handleRegisterClick}
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
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          onEditClick={handleEditClick}
          actions={actions}
        />
      )}

      {modalOpen && (
        <UserModal
          show={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setFlag(true);
          }}
          onSubmit={handleConfirmSubmit}
          handleChange={handleChange}
          user={tempUser || {}}
          roles={roles}
          genders={genders}
          memberships={filteredMemberships}
          errors={errors || {}}
          flag={flag}
        />
      )}

      {isUserProjectsModalOpen && selectedUserId && (
        <UserProjectsModal
          show={isUserProjectsModalOpen}
          onClose={() => setIsUserProjectsModalOpen(false)}
          userId={selectedUserId}
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
