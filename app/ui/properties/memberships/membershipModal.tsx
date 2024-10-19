import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Membership } from "@/lib/definitios";

interface MembershipModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  membership: Membership;
  errors: {
    nameError: string;
    benefitsError: string;
    priceError: string;
    discountThreeMonthsError: string;
    discountSixMonthsError: string;
    discountTwelveMonthsError: string;
    maxPropertiesError: string;
    maxImagesError: string;
  };
}

const MembershipModal: React.FC<MembershipModalProps> = ({
  show,
  onClose,
  onSubmit,
  handleChange,
  membership,
  errors,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-secondaryLight dark:bg-darkBackground bg-opacity-50">
      <div className="bg-background dark:bg-darkBackgroundLight rounded-lg shadow-xl w-full max-w-2xl mx-4 px-4 py-2">
        {/* Encabezado */}
        <div className="flex items-center justify-between p-4 border-b border-borderColor dark:border-borderColor">
          <h5 className="text-xl font-semibold text-primary dark:text-primaryLight">
            Editar Membresía
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary dark:text-darkTextPrimary hover:text-primary text-3xl"
          >
            &times;
          </button>
        </div>

        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {/* Formulario de Membresía */}
          <form
            id="membershipForm"
            onSubmit={onSubmit}
            noValidate
            className="grid grid-cols-1 grid-rows-10 sm:grid-cols-2 sm:grid-rows-7 gap-x-4 gap-y-0"
          >
            {/* Nombre */}
            <div className="row-start-1 sm:col-span-2 p-0">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">Nombre</label>
              <input
                type="text"
                name="name"
                value={membership.name}
                onChange={handleChange}
                placeholder="Nombre de la membresía"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.nameError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.nameError ? "hidden" : "block"
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.nameError}
              </div>
            </div>

            {/* Beneficios */}
            <div className="sm:col-span-2 row-span-2 row-start-2">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">Descripción</label>
              <textarea
                name="description"
                value={membership.benefits}
                onChange={handleChange}
                placeholder="Descripción de la membresía"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary resize-none ${
                  errors.benefitsError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
                rows={4}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.benefitsError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.benefitsError}
              </div>
            </div>

            {/* Precio */}
            <div className="row-start-4">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">Precio</label>
              <input
                type="number"
                name="price"
                value={membership.price}
                min={0}
                onChange={handleChange}
                placeholder="Precio"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.priceError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.priceError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.priceError}
              </div>
            </div>

            {/* Propiedades Destacadas */}
            <div className="row-start-5 sm:row-start-4">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Propiedades Destacadas
              </label>
              <input
                type="number"
                name="propertiesFeatured"
                min={0}
                value={membership.propertiesFeatured}
                onChange={handleChange}
                placeholder="Cantiadad de propiedades destacadas"
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary border-borderColor dark:border-borderColor"
              />
            </div>

            {/* Max. Propiedades */}
            <div className="row-start-6 sm:row-start-5">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Max. Propiedades
              </label>
              <input
                type="number"
                name="maxProperties"
                value={membership.maxProperties}
                min={0}
                onChange={handleChange}
                placeholder="Cantidad máxima de propiedades"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.maxPropertiesError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.maxPropertiesError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.maxPropertiesError}
              </div>
            </div>

            {/* Max. Imágenes por Propiedad */}
            <div className="row-start-7 sm:row-start-5">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Max. Imágenes por Propiedad
              </label>
              <input
                type="number"
                name="maxImagesProperty"
                value={membership.maxImagesProperty}
                min={0}
                onChange={handleChange}
                placeholder="Cantidad máxima de imágenes"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.maxImagesError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.maxImagesError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.maxImagesError}
              </div>
            </div>

            {/* Descuento 3 meses */}
            <div className="row-start-8 sm:row-start-6">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Descuento por 3 Meses
              </label>
              <input
                type="number"
                name="discountThreeMonths"
                min={0}
                max={100}
                value={membership.discountThreeMonths}
                onChange={handleChange}
                placeholder="Porcentaje de descuentro por 3 meses"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.discountThreeMonthsError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.discountThreeMonthsError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.discountThreeMonthsError}
              </div>
            </div>

            {/* Descuento 6 meses */}
            <div className="row-start-9 sm:row-start-6">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Descuento por 6 Meses
              </label>
              <input
                type="number"
                name="discountSixMonths"
                value={membership.discountSixMonths}
                min={0}
                max={100}
                onChange={handleChange}
                placeholder="Porcentaje de descuento por 6 Meses"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.discountSixMonthsError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.discountSixMonthsError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.discountSixMonthsError}
              </div>
            </div>

            {/* Descuento 12 meses */}
            <div className="row-start-10 sm:row-start-7">
              <label className="text-sm font-medium mb-2 text-textPrimary dark:text-darkTextPrimary">
                Descuento por 12 Meses
              </label>
              <input
                type="number"
                name="discountTwelveMonths"
                value={membership.discountTwelveMonths}
                min={0}
                max={100}
                onChange={handleChange}
                placeholder="Porcentaje de descuento por 12 Meses"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary ${
                  errors.discountTwelveMonthsError
                    ? "border-red-500 bg-red-50"
                    : "border-borderColor dark:border-borderColor"
                }`}
              />
              <div
                className={`text-red-500 text-xs flex items-center gap-2 mt-1 ${
                  !errors.discountTwelveMonthsError ? "hidden" : ""
                }`}
              >
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.discountTwelveMonthsError}
              </div>
            </div>

            {/* Botones */}
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-textPlaceholder hover:text-secondary dark:bg-darkTextPrimary dark:hover:bg-darkTextSecondary text-white dark:text-darkBackground rounded-lg mr-2 hover:scale-105 hover:bg-gray-600 transition transform duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primaryDark dark:bg-primary dark:hover:bg-primaryDark text-white rounded-lg hover:scale-105 hover:bg-blue-700 transition transform duration-300"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;
