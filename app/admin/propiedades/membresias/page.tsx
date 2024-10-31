"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Table from "@/app/ui/properties/table";
import MembershipModal from "@/app/ui/properties/memberships/membershipModal";
import { Membership } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const [updateMembership, setUpdateMembership] = useState({
    id: 0,
    name: "",
    benefits: "",
    price: 0,
    propertiesFeatured: 0,
    maxProperties: 0,
    maxImagesProperty: 0,
    discountThreeMonths: 0,
    discountSixMonths: 0,
    discountTwelveMonths: 0,
  });

  const [errors, setErrors] = useState({
    nameError: "",
    benefitsError: "",
    priceError: "",
    discountThreeMonthsError: "",
    discountSixMonthsError: "",
    discountTwelveMonthsError: "",
    maxPropertiesError: "",
    maxImagesError: "",
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    console.log(term);
    setCurrentPage(1);
  }, 300);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get(
        `/api/properties/metadata/memberships?page=${currentPage}&pageSize=${entriesPerPage}&searchTerm=${searchTerm}`
      );
      setMemberships(response.data.memberships);
      setTotalEntries(response.data.totalEntries);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [currentPage, entriesPerPage, searchTerm]);

  const validateFields = () => {
    let isValid = true;
    let tempErrors = {
      nameError: "",
      benefitsError: "",
      priceError: "",
      discountThreeMonthsError: "",
      discountSixMonthsError: "",
      discountTwelveMonthsError: "",
      maxPropertiesError: "",
      maxImagesError: "",
    };

    if (!updateMembership.name.trim()) {
      tempErrors.nameError = "El nombre es obligatorio.";
      isValid = false;
    }

    if (!updateMembership.benefits.trim()) {
      tempErrors.benefitsError =
        "La descripción de los beneficios es obligatoria.";
      isValid = false;
    }

    if (updateMembership.price <= 0) {
      tempErrors.priceError = "El precio debe ser mayor a 0.";
      isValid = false;
    }

    if (updateMembership.discountThreeMonths <= 0) {
      tempErrors.discountThreeMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
      isValid = false;
    }

    if (updateMembership.discountSixMonths <= 0) {
      tempErrors.discountSixMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
      isValid = false;
    }

    if (updateMembership.discountTwelveMonths <= 0) {
      tempErrors.discountTwelveMonthsError =
        "El porcentaje de descuento debe ser mayor a 0.";
      isValid = false;
    }

    if (updateMembership.maxProperties <= 0) {
      tempErrors.maxPropertiesError = "Debe haber al menos 1 propiedad.";
      isValid = false;
    }

    if (updateMembership.maxImagesProperty <= 0) {
      tempErrors.maxImagesError = "Debe haber al menos 1 imagen.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const resetErrors = () => {
    setErrors({
      nameError: "",
      benefitsError: "",
      priceError: "",
      discountThreeMonthsError: "",
      discountSixMonthsError: "",
      discountTwelveMonthsError: "",
      maxPropertiesError: "",
      maxImagesError: "",
    });
  };

  const handleEditClick = (membership: Membership) => {
    setUpdateMembership(membership);
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await axios.put("/api/properties/metadata/memberships", updateMembership);
      setModalOpen(false);
      fetchMemberships();
    } catch (error) {
      console.error("Error actualizando la membresía:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUpdateMembership({
      ...updateMembership,
      [name]: value,
    });

    console.log(updateMembership);
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

  const headers: { label: string; key: keyof Membership }[] = [
    { label: "Membresía", key: "name" },
    { label: "Beneficios", key: "benefits" },
    { label: "Precio", key: "price" },
    { label: "Propiedades Destacadas", key: "propertiesFeatured" },
    { label: "Max. Propiedades", key: "maxProperties" },
    { label: "Max. Imágenes por Propiedad", key: "maxImagesProperty" },
    { label: "Descuento por 3 Meses", key: "discountThreeMonths" },
    { label: "Descuento por 6 Meses", key: "discountSixMonths" },
    { label: "Descuento por 12 Meses", key: "discountTwelveMonths" },
  ];

  return (
    <div className="container mx-auto mt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary dark:text-primaryLight pb-5">
        Gestión de Membresías
      </h1>

      <div className="px-4 lg:px-8 py-5 bg-backgroundLight dark:bg-secondaryLight rounded-3xl lg:mx-4 shadow-lg">
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
      </div>

      <MembershipModal
        show={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetErrors();
        }}
        onSubmit={handleUpdate}
        handleChange={handleChange}
        membership={updateMembership}
        errors={errors}
      />

      <button
        onClick={() => router.push("/admin/propiedades")}
        className="px-4 py-2 mt-4 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors dark:bg-primary dark:hover:bg-primaryDark dark:text-backgroundLight mx-auto block"
      >
        Volver
      </button>
    </div>
  );
}
