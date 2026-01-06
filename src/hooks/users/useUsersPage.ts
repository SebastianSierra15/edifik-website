import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";

import type { MembershipSummary, User, UserWrite } from "@/src/interfaces";
import { useAlert, useConfirmation } from "@/src/providers";
import { useProjectApi } from "@/src/hooks/projects";

import { useGetUserProjects } from "./useGetUserProjects";
import { useUserApi } from "./useUserApi";
import { useUserValidation } from "./useUserValidation";
import { useUsers } from "./useUsers";
import { useUsersMetadata } from "./useUsersMetadata";

type UserFormState = Partial<User>;

const mapUserToWrite = (user: UserFormState): UserWrite => ({
  id: user.id,
  names: user.names ?? "",
  lastnames: user.lastnames ?? "",
  email: user.email ?? "",
  phoneNumber: user.phoneNumber ?? null,
  genderId: user.gender?.id ?? 0,
  roleId: user.role?.id ?? 0,
  membershipId: user.membership?.id ?? 0,
  state: user.state ?? false,
});

export function useUsersPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const confirm = useConfirmation();

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<UserFormState | null>(null);
  const [flag, setFlag] = useState(true);

  const [isUserProjectsModalOpen, setIsUserProjectsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { users, totalEntries, isLoadingUsers, refetchUsers } = useUsers(
    currentPage,
    entriesPerPage,
    searchTerm
  );
  const { roles, genders, memberships } = useUsersMetadata();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const showSkeleton = !hasLoadedOnce && isLoadingUsers;

  useEffect(() => {
    if (!isLoadingUsers && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [hasLoadedOnce, isLoadingUsers]);

  const { errors, validateFields } = useUserValidation(
    tempUser || {},
    Boolean(editUser)
  );

  const { submitUser, error: submitError } = useUserApi();

  const filteredMemberships = useMemo<MembershipSummary[]>(
    () => memberships.filter((membership) => membership.id !== 1004),
    [memberships]
  );

  useEffect(() => {
    if (!modalOpen) return;
    if (!tempUser) return;
    if (tempUser.membership?.id) return;
    if (filteredMemberships.length === 0) return;

    setTempUser((prev) => ({
      ...(prev || {}),
      membership: filteredMemberships[0],
    }));
  }, [filteredMemberships, modalOpen, tempUser]);

  const { submitProject, isProcessing: isProjectProcessing } = useProjectApi();

  const {
    projects: userProjects,
    totalEntries: userProjectsTotalEntries,
    isLoading: isLoadingUserProjects,
    refreshUserProjects,
  } = useGetUserProjects({
    userId: selectedUserId ?? 0,
    entriesPerPage: 10,
  });

  const openEditModal = useCallback((user: User) => {
    setEditUser(user);
    setTempUser({ ...user });
    setModalOpen(true);
  }, []);

  const openRegisterModal = useCallback(() => {
    setEditUser(null);
    setTempUser({});
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setFlag(true);
  }, []);

  const handleConfirmSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFlag(false);

      const isValid = await validateFields();

      if (!isValid) {
        return;
      }

      if (!tempUser) {
        return;
      }

      const action = editUser ? "edit" : "register";
      const accepted = await confirm({
        title: "Confirmar Acción",
        message: `¿Estás seguro de que quieres ${
          action === "edit" ? "editar" : "registrar"
        } este usuario?`,
        action: action === "edit" ? "edit" : "create",
      });

      if (!accepted) {
        setFlag(true);
        return;
      }

      const payload = mapUserToWrite(tempUser);
      const success = await submitUser(payload, action);

      if (!success) {
        showAlert({
          type: "error",
          message:
            submitError || "Lo sentimos, algo salió mal, inténtalo más tarde.",
        });
        return;
      }

      setModalOpen(false);
      setFlag(true);

      if (action === "edit") {
        setEditUser(tempUser as User);
      }

      await refetchUsers();

      showAlert({
        type: "success",
        message: `Usuario ${action === "edit" ? "editado" : "registrado"} correctamente.`,
      });
    },
    [
      confirm,
      editUser,
      refetchUsers,
      showAlert,
      submitError,
      submitUser,
      tempUser,
      validateFields,
    ]
  );

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const newValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      const updateNestedValue = (obj: UserFormState, path: string) => {
        const keys = path.split(".");
        const result = { ...(obj || {}) } as Record<string, unknown>;
        let current: Record<string, unknown> = result;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = newValue;
          } else {
            const nextValue = current[key];
            if (!nextValue || typeof nextValue !== "object") {
              current[key] = {};
            }
            current = current[key] as Record<string, unknown>;
          }
        });

        return result as UserFormState;
      };

      setTempUser((prev) => updateNestedValue(prev || {}, name));
    },
    []
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleEntriesPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setEntriesPerPage(Number(e.target.value));
      setCurrentPage(1);
    },
    []
  );

  const onSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const openUserProjectsModal = useCallback((userId: number) => {
    setSelectedUserId(userId);
    setIsUserProjectsModalOpen(true);
  }, []);

  const closeUserProjectsModal = useCallback(() => {
    setIsUserProjectsModalOpen(false);
    setSelectedUserId(null);
  }, []);

  const handleDeleteUserProject = useCallback(
    async (projectId: number, projectName: string) => {
      if (isProjectProcessing) return;

      const accepted = await confirm({
        title: "Eliminar Propiedad",
        message: `¿Estás seguro de que deseas eliminar la propiedad "${projectName}"?`,
        action: "delete",
      });

      if (!accepted) {
        return;
      }

      const success = await submitProject(projectId, "delete");

      if (!success) {
        showAlert({
          type: "error",
          message: `Error al eliminar la propiedad "${projectName}".`,
        });
        return;
      }

      showAlert({
        type: "success",
        message: `Propiedad "${projectName}" eliminada exitosamente.`,
      });

      refreshUserProjects();
    },
    [
      confirm,
      isProjectProcessing,
      refreshUserProjects,
      showAlert,
      submitProject,
    ]
  );

  const handleEditUserProject = useCallback(
    (projectId: number) => {
      router.push(`/admin/inmobiliaria/${projectId}`);
    },
    [router]
  );

  return {
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
    memberships: filteredMemberships,
    errors,
    flag,
    isUserProjectsModalOpen,
    selectedUserId,
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
  };
}
