"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Role, Header } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";
import { Plus } from "lucide-react";
import { useRoles } from "@/app/hooks/roles/useRoles";
import { useRoleValidation } from "@/app/hooks/roles/useRoleValidation";
import { useRoleApi } from "@/app/hooks/roles/useRoleApi";
import { usePermissions } from "@/app/hooks/roles/usePermissions";
import Table from "@/app/ui/admin/table";
import TableSkeleton from "@/app/ui/admin/skeletons/tableSkeleton";
import Alert from "@/app/ui/alert";
import ModalConfirmation from "@/app/ui/modals/modalConfirmation";

const RoleModal = dynamic(() => import("@/app/ui/roles/roleModal"), {
  ssr: false,
});

export default function RolesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [registerRole, setRegisterRole] = useState<Role>({
    id: 0,
    name: "",
    permissions: [],
  });
  const [tempEditRole, setTempEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "register" | "edit" | "delete" | null
  >(null);
  const [flag, setFlag] = useState(true);
  const [alert, setAlert] = useState({
    type: "" as "success" | "error" | null,
    message: "",
    show: false,
  });

  const { roles, totalEntries, isLoadingRoles, refetchRoles } = useRoles(
    currentPage,
    entriesPerPage,
    searchTerm
  );
  const { permissions } = usePermissions();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const showSkeleton = !hasLoadedOnce && isLoadingRoles;
  if (!isLoadingRoles && !hasLoadedOnce) {
    setHasLoadedOnce(true);
  }

  const { errors, validateFields, validateField } = useRoleValidation(
    editRole || registerRole,
    !!editRole
  );

  const { submitRole } = useRoleApi();

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const handleEditClick = (role: Role) => {
    setEditRole(role);
    setTempEditRole({ ...role });
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    setEditRole(null);
    setRegisterRole({ id: 0, name: "", permissions: [] });
    setModalOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setDeleteRole(role);
    setConfirmationAction("delete");
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    let roleData: Role | null = null;

    if (confirmationAction === "delete") {
      if (!deleteRole || !deleteRole.id) {
        console.error("Error: No se puede eliminar un rol sin ID.");
        setAlert({
          type: "error",
          message: "Error: No se puede eliminar un rol sin ID.",
          show: true,
        });
        return;
      }
      roleData = deleteRole;
    } else {
      roleData = confirmationAction === "edit" ? tempEditRole : registerRole;
    }

    if (!roleData) return;

    const success = await submitRole(roleData, confirmationAction!);

    if (success) {
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      setFlag(true);

      if (confirmationAction === "edit") {
        setEditRole(tempEditRole);
      }

      await refetchRoles();

      setAlert({
        type: "success",
        message: `Rol ${
          confirmationAction === "edit"
            ? "editado"
            : confirmationAction === "delete"
              ? "eliminado"
              : "registrado"
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

    setConfirmationAction(editRole ? "edit" : "register");
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setFlag(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "addPermission") {
      const selectedPermission = permissions.find(
        (perm) => perm.id === Number(value)
      );
      if (!selectedPermission) return;

      if (tempEditRole) {
        setTempEditRole((prev) => ({
          ...prev!,
          permissions: [...(prev!.permissions || []), selectedPermission],
        }));
      } else {
        setRegisterRole((prev) => ({
          ...prev,
          permissions: [...(prev.permissions || []), selectedPermission],
        }));
      }
    } else if (name === "deletePermission") {
      if (tempEditRole) {
        setTempEditRole((prev) => ({
          ...prev!,
          permissions: prev!.permissions?.filter(
            (perm) => perm.id !== Number(value)
          ),
        }));
      } else {
        setRegisterRole((prev) => ({
          ...prev,
          permissions: prev.permissions?.filter(
            (perm) => perm.id !== Number(value)
          ),
        }));
      }
    } else {
      if (tempEditRole) {
        setTempEditRole((prev) => ({
          ...prev!,
          [name]: value,
        }));
      } else {
        setRegisterRole((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
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

  const headers: Header<Role>[] = [
    { label: "Id", key: "id", type: "number" },
    { label: "Nombre", key: "name", type: "string" },
    { label: "Permisos", key: "permissions", type: "array", subKey: "name" },
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-premium-primary dark:text-premium-primaryLight pb-5">
        Gestión de Roles
      </h1>

      <div className="mb-4 flex justify-center px-4 md:justify-end">
        <button
          onClick={handleRegisterClick}
          className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          <Plus className="mr-2 size-6" />
          <span>Registrar Rol</span>
        </button>
      </div>

      {showSkeleton ? (
        <TableSkeleton rows={3} columns={headers.length + 1} />
      ) : (
        <Table
          data={roles}
          headers={headers}
          totalEntries={totalEntries}
          entry="roles"
          currentPage={currentPage}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          entriesPerPage={entriesPerPage}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          handleSearchChange={(e) => debouncedSearch(e.target.value)}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          canDelete={true}
        />
      )}

      {modalOpen && (
        <RoleModal
          show={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setFlag(true);
          }}
          onSubmit={handleConfirmSubmit}
          handleChange={handleChange}
          role={tempEditRole || registerRole}
          permissions={permissions}
          errors={errors}
          flag={flag}
        />
      )}

      {isConfirmationModalOpen && (
        <ModalConfirmation
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmedAction}
          title="Confirmar Acción"
          message={`¿Estás seguro de que quieres ${confirmationAction === "edit" ? "editar" : "registrar"} este rol?`}
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
