"use client";

import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";

import { useAlert, useConfirmation } from "@/src/providers";

import type {
  Permission,
  RoleWithPermissions,
  RoleWrite,
} from "@/src/interfaces";
import {
  useRoles,
  useRoleApi,
  useRoleMetadata,
  useRoleValidation,
} from "@/src/hooks/roles";

import { Table, TableSkeleton } from "@/src/components/shared";

const RoleModal = dynamic(
  () => import("@/src/components/admin/roles").then((mod) => mod.RoleModal),
  { ssr: false }
);

type RoleAction = "create" | "edit" | "delete";

function mapRoleToWrite(role: RoleWithPermissions): RoleWrite {
  return {
    id: role.id || undefined,
    name: role.name,
    permissions: (role.permissions ?? []).map((p) => p.id),
  };
}

function createEmptyRole(): RoleWithPermissions {
  return { id: 0, name: "", permissions: [] };
}

export default function RolesPage() {
  // providers
  const { showAlert } = useAlert();
  const confirm = useConfirmation();

  // table ux
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // modals & action
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<RoleAction | null>(null);

  // form state (single source of truth)
  const [activeRole, setActiveRole] =
    useState<RoleWithPermissions>(createEmptyRole());

  // ui helpers
  const [flag, setFlag] = useState<boolean>(true);

  const { roles, totalEntries, loading, refetchRoles } = useRoles(
    currentPage,
    entriesPerPage,
    searchTerm
  );

  const { permissions } = useRoleMetadata();
  const { submitRole, error } = useRoleApi();

  const roleWrite = useMemo(() => mapRoleToWrite(activeRole), [activeRole]);

  const { errors, validateFields } = useRoleValidation(
    roleWrite,
    action === "edit"
  );

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  // ------- handlers -------
  const openCreate = () => {
    setActiveRole(createEmptyRole());
    setAction("create");
    setModalOpen(true);
  };

  const openEdit = (role: RoleWithPermissions) => {
    setActiveRole({ ...role, permissions: role.permissions ?? [] });
    setAction("edit");
    setModalOpen(true);
  };

  const openDelete = async (role: RoleWithPermissions) => {
    setAction("delete");

    const accepted = await confirm({
      title: "Eliminar rol",
      message: "¿Estás seguro de que quieres eliminar este rol?",
      confirmClassName: "bg-red-600 hover:bg-red-700",
    });

    if (!accepted) return;

    await handleConfirmedAction("delete", role.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFlag(true);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlag(false);

    if (!action || action === "delete") return;

    const isValid = await validateFields();
    if (!isValid) return;

    const accepted = await confirm({
      title: "Confirmar acción",
      message: confirmMessage,
    });

    if (!accepted) return;

    await handleConfirmedAction();
  };

  const handleConfirmedAction = async (
    forcedAction?: RoleAction,
    roleId?: number
  ): Promise<void> => {
    const finalAction = forcedAction ?? action;
    if (!finalAction) return;

    let success = false;

    if (finalAction === "delete") {
      const idToDelete = roleId ?? activeRole.id;
      if (!idToDelete) return;

      success = await submitRole(
        { id: idToDelete, name: "", permissions: [] },
        "delete"
      );
    } else {
      success = await submitRole(roleWrite, finalAction);
    }

    if (!success) {
      showAlert({
        type: "error",
        message: error ?? "Lo sentimos, algo salió mal.",
      });
      return;
    }

    setModalOpen(false);
    setFlag(true);

    await refetchRoles();

    showAlert({
      type: "success",
      message: `Rol ${
        finalAction === "edit"
          ? "editado"
          : finalAction === "delete"
            ? "eliminado"
            : "registrado"
      } correctamente.`,
    });

    setAction(null);
    setActiveRole(createEmptyRole());
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "addPermission") {
      const selected = permissions.find(
        (p: Permission) => p.id === Number(value)
      );
      if (!selected) return;

      setActiveRole((prev) => ({
        ...prev,
        permissions: [...(prev.permissions ?? []), selected],
      }));
      return;
    }

    if (name === "deletePermission") {
      setActiveRole((prev) => ({
        ...prev,
        permissions: (prev.permissions ?? []).filter(
          (p) => p.id !== Number(value)
        ),
      }));
      return;
    }

    setActiveRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goToNextPage = () => setCurrentPage((p) => p + 1);
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // headers (mantengo tu Table actual)
  const headers = useMemo(
    () => [
      { label: "Id", key: "id", type: "number" },
      { label: "Nombre", key: "name", type: "string" },
      { label: "Permisos", key: "permissions", type: "array", subKey: "name" },
    ],
    []
  );

  const confirmMessage = useMemo(() => {
    if (action === "delete")
      return "¿Estás seguro de que quieres eliminar este rol?";
    if (action === "edit")
      return "¿Estás seguro de que quieres editar este rol?";
    return "¿Estás seguro de que quieres registrar este rol?";
  }, [action]);

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
          onSearch={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          onClearSearch={() => {
            setSearchTerm("");
            setCurrentPage(1);
          }}
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
