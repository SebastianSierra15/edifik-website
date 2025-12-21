import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAlert, useConfirmation } from "@/src/providers";
import type {
  Permission,
  RoleWithPermissions,
  RoleWrite,
} from "@/src/interfaces";

import { useRoleApi } from "./useRoleApi";
import { useRoleMetadata } from "./useRoleMetadata";
import { useRoleValidation } from "./useRoleValidation";
import { useRoles } from "./useRoles";

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

export function useRolesPage() {
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

  const confirmMessage = useMemo(() => {
    if (action === "delete")
      return "?Est?s seguro de que quieres eliminar este rol?";
    if (action === "edit")
      return "?Est?s seguro de que quieres editar este rol?";
    return "?Est?s seguro de que quieres registrar este rol?";
  }, [action]);

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
      message: "?Est?s seguro de que quieres eliminar este rol?",
      confirmClassName: "bg-red-600 hover:bg-red-700",
    });

    if (!accepted) return;

    await handleConfirmedAction("delete", role.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFlag(true);
  };

  const handleConfirmSubmit = async (e: FormEvent) => {
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
        message: error ?? "Lo sentimos, algo sali? mal.",
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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleEntriesPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const onClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
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
  };
}
