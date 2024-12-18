"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import Table from "@/app/ui/table";
import MembershipModal from "@/app/ui/memberships/membershipModal";
import ModalConfirmation from "@/app/ui/modalConfirmation";
import ModalAlert from "@/app/ui/modalAlert";
import TableSkeleton from "@/app/ui/tableSkeleton";
import { Membership, Header } from "@/lib/definitios";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"edit" | null>(
    null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [updateMembership, setUpdateMembership] = useState({
    id: 0,
    name: "",
    benefits: "",
    price: 0,
    projectsFeatured: 0,
    maxProjects: 0,
    discountThreeMonths: 0,
    discountSixMonths: 0,
    discountTwelveMonths: 0,
  });

  const [errors, setErrors] = useState({
    nameError: "",
    benefitsError: "",
    discountThreeMonthsError: "",
    discountSixMonthsError: "",
    discountTwelveMonthsError: "",
    maxProjectsError: "",
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get(
        `/api/memberships?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${searchTerm}`
      );
      setMemberships(response.data.memberships);
      setTotalEntries(response.data.totalEntries);
    } catch (error) {
      console.error("Error al recuperar las membresias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [currentPage, entriesPerPage, searchTerm]);

  const validateFields = () => {
    const newErrors = { ...errors };

    if (!updateMembership.name.trim()) {
      newErrors.nameError = "El nombre es obligatorio.";
    }

    if (!updateMembership.benefits.trim()) {
      newErrors.benefitsError =
        "La descripción de los beneficios es obligatoria.";
    }

    if (updateMembership.discountThreeMonths <= 0) {
      newErrors.discountThreeMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
    }

    if (updateMembership.discountSixMonths <= 0) {
      newErrors.discountSixMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
    }

    if (updateMembership.discountTwelveMonths <= 0) {
      newErrors.discountTwelveMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
    }

    if (updateMembership.maxProjects <= 0) {
      newErrors.maxProjectsError = "Debe haber al menos 1 propiedad.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const resetErrors = () => {
    setErrors({
      nameError: "",
      benefitsError: "",
      discountThreeMonthsError: "",
      discountSixMonthsError: "",
      discountTwelveMonthsError: "",
      maxProjectsError: "",
    });
  };

  const handleEditClick = (membership: Membership) => {
    setUpdateMembership(membership);
    setModalOpen(true);
  };

  const handleConfirmUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    setConfirmationAction("edit");
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmedAction = async () => {
    try {
      if (confirmationAction === "edit") {
        await axios.put("/api/memberships", updateMembership);
      }
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      fetchMemberships();
    } catch (error) {
      setModalOpen(false);
      setIsConfirmationModalOpen(false);
      console.error("Error al procesar la acción:", error);
      setAlertMessage(
        "Hubo un error al actualizar la membresía. Por favor, inténtalo de nuevo."
      );
      setShowAlert(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const formattedPrice = value.replace(/[^0-9]/g, "");
      setUpdateMembership({
        ...updateMembership,
        price: formattedPrice ? parseInt(formattedPrice, 10) : 0,
      });
    } else {
      setUpdateMembership({
        ...updateMembership,
        [name]: value,
      });
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

  const headers: Header<Membership>[] = [
    { label: "Membresía", key: "name", type: "string" },
    { label: "Beneficios", key: "benefits", type: "string" },
    { label: "Precio", key: "price", type: "number" },
    { label: "Proyectos Destacados", key: "projectsFeatured", type: "number" },
    { label: "Max. Proyectos", key: "maxProjects", type: "number" },
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
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-premium-primary dark:text-premium-primaryLight pb-5">
        Gestión de Membresías
      </h1>

      <div className="px-4 lg:px-8 py-5 bg-premium-backgroundLight dark:bg-premium-secondaryLight rounded-3xl lg:mx-4 shadow-lg">
        {isLoading ? (
          <TableSkeleton rows={3} columns={headers.length + 1} />
        ) : (
          <Table
            data={memberships.filter((membership) => membership.id !== 1004)}
            headers={headers}
            totalEntries={totalEntries}
            entry="membresías"
            currentPage={currentPage}
            totalPages={Math.ceil(totalEntries / entriesPerPage)}
            goToPage={goToPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            entriesPerPage={entriesPerPage}
            handleEntriesPerPageChange={handleEntriesPerPageChange}
            handleSearchChange={(e) => debouncedSearch(e.target.value)}
            canDelete={false}
            onEditClick={handleEditClick}
          />
        )}
      </div>

      <MembershipModal
        show={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetErrors();
        }}
        onSubmit={handleConfirmUpdate}
        handleChange={handleChange}
        membership={updateMembership}
        errors={errors}
      />

      <ModalConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmedAction}
        icon={
          <AiOutlineCheckCircle className="w-10 h-10 text-premium-primary" />
        }
        title="Confirmar Acción"
        message="¿Estás seguro de que quieres actualizar esta membresía?"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <ModalAlert
        title="Advertencia"
        message={alertMessage}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />

      {/*
      <button
        onClick={() => router.push("/admin/proyectos")}
        className="px-4 py-2 mt-4 bg-premium-primary text-white rounded-lg hover:bg-premium-primaryDark transition-colors dark:bg-premium-primary dark:hover:bg-premium-primaryDark dark:text-premium-backgroundLight mx-auto block"
      >
        Volver
      </button>*/}
    </div>
  );
}
