"use client";

import { useState } from "react";
import { Category } from "@/lib/definitios";
import { PropertyType } from "@/lib/definitios";

type BasicPropertyFormProps = {
  onSubmit: (data: any) => void;
  categories: Category[];
  propertyTypes: PropertyType[];
};

export default function BasicPropertyForm({
  onSubmit,
  categories,
  propertyTypes,
}: BasicPropertyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type) {
      onSubmit(formData);
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-backgroundLight dark:bg-secondary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary text-center mb-6">
        Datos Básicos
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-textPrimary dark:text-textSecondary mb-2">
            Nombre de la propiedad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-background dark:bg-backgroundDark text-textPrimary dark:text-textSecondary border-borderColor dark:border-borderColorHover"
            placeholder="Ingrese el nombre de la propiedad"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-textPrimary dark:text-textSecondary mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-background dark:bg-backgroundDark text-textPrimary dark:text-textSecondary border-borderColor dark:border-borderColorHover"
            placeholder="Agregue una descripción detallada"
            rows={5}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-textPrimary dark:text-textSecondary mb-2">
            Categoría
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-background dark:bg-backgroundDark text-textPrimary dark:text-textSecondary border-borderColor dark:border-borderColorHover"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className="block text-textPrimary dark:text-textSecondary mb-2">
            Tipo de propiedad <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-background dark:bg-backgroundDark text-textPrimary dark:text-textSecondary border-borderColor dark:border-borderColorHover"
            required
          >
            <option value="">Seleccione el tipo</option>
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
