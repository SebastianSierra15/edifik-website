"use client";

import { useEffect, useState } from "react";
import { ClientFormInput } from "@/src/components/shared";
import { changePasswordSchema } from "@/src/schemas/user";

interface ModalChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRequest: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void;
}

export function ModalChangePassword({
  isOpen,
  onClose,
  onConfirmRequest,
}: ModalChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleValidate = () => {
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConfirmRequest({
      currentPassword,
      newPassword,
    });
  };

  return isOpen ? (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-client-backgroundAlt w-full max-w-md rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-center text-client-text mb-6">
            Cambiar contraseña
          </h2>

          <div className="space-y-4">
            <ClientFormInput
              label="Contraseña actual"
              name="currentPassword"
              type="password"
              value={currentPassword}
              placeholder="Escribe tu contraseña actual"
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                clearFieldError("currentPassword");
              }}
              error={errors.currentPassword}
              isAccent
            />

            <ClientFormInput
              label="Nueva contraseña"
              name="newPassword"
              type="password"
              value={newPassword}
              placeholder="Mínimo 8 caracteres"
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearFieldError("newPassword");
              }}
              error={errors.newPassword}
              isAccent
              isEdit={!!currentPassword}
            />

            <ClientFormInput
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Repite la nueva contraseña"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              error={errors.confirmPassword}
              isAccent
              isEdit={!!currentPassword}
            />

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleValidate}
                className="w-full rounded-md bg-client-accent text-white py-2 font-semibold hover:bg-client-accentHover transition"
              >
                Cambiar contraseña
              </button>

              <button
                onClick={() => {
                  onClose();
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setErrors({});
                }}
                className="w-full rounded-md bg-client-background text-white py-2 font-semibold hover:bg-client-backgroundLight transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
