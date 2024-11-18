interface ConfirmDeleteModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function ConfirmDeleteModal({
  show,
  onClose,
  onDelete,
}: ConfirmDeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800">
          Eliminar Membresía
        </h2>
        <p className="mt-4 text-gray-600">
          ¿Estás seguro de que deseas eliminar esta membresía? Esta acción no se
          puede deshacer.
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
