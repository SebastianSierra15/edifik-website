"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { User } from "@/lib/definitios";
import { useUserProfile } from "@/app/hooks/user/useUserProfile";
import { useUpdateUserProfile } from "@/app/hooks/user/useUpdateUserProfile";
import { useChangePassword } from "@/app/hooks/auth/resetPassword/useChangePassword";
import ModalConfirmation from "../modals/home/modalConfirmation";
import ModalChangePassword from "./modalChangePassword";
import Alert from "../alert";
import Loader from "../loader";

const ProfileForm = dynamic(() => import("../../ui/profile/profileForm"), {
  ssr: false,
});

export default function ClientProfilePage() {
  const { user, genders, loading, error } = useUserProfile();
  const [userState, setUserState] = useState<User | null>(user);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<
    "update" | "password" | null
  >(null);
  const [passwordData, setPasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
  } | null>(null);

  useEffect(() => {
    if (user) setUserState(user);
  }, [user]);

  const {
    updateUserProfile,
    loading: updating,
    error: updateError,
    success,
  } = useUpdateUserProfile();

  const {
    changePassword,
    loading: changingPassword,
    error: changePasswordError,
    success: passwordSuccess,
  } = useChangePassword();

  const [pendingData, setPendingData] = useState<Partial<User> | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmitRequest = (data: Partial<User>) => {
    setPendingData(data);
    setActionToConfirm("update");
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (actionToConfirm === "update" && pendingData) {
      const success = await updateUserProfile(pendingData);
      if (success) {
        setUserState((prev) => ({ ...prev!, ...pendingData }));
      }
      setPendingData(null);
    }

    if (actionToConfirm === "password" && passwordData) {
      const success = await changePassword(passwordData);
      setPasswordData(null);
    }

    setShowConfirmModal(false);
    setActionToConfirm(null);
  };

  const handleCancel = () => {
    setPendingData(null);
    setShowConfirmModal(false);
  };

  const openPasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handlePasswordChange = (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (!user) return;
    setPasswordData(data);
    setActionToConfirm("password");
    setShowConfirmModal(true);
    setShowChangePasswordModal(false);
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-4xl mx-auto px-4">
        {success && (
          <Alert type="success" message="Datos actualizados correctamente" />
        )}

        {updateError && <Alert type="error" message={updateError} />}

        {changePasswordError && (
          <Alert type="error" message={changePasswordError} />
        )}

        {passwordSuccess && (
          <Alert
            type="success"
            message="Contraseña actualizada correctamente"
          />
        )}

        <div className="bg-client-backgroundAlt p-10 rounded-2xl shadow my-12">
          <h2 className="text-3xl mb-8 font-bold text-center text-client-text">
            Mi perfil
          </h2>

          {loading && (
            <p className="text-center text-client-text">Cargando perfil...</p>
          )}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {user && (
            <div className="relative">
              {updating && (
                <div className="absolute inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center rounded-2xl">
                  <Loader size={40} />
                </div>
              )}

              {userState && (
                <ProfileForm
                  user={userState}
                  genders={genders}
                  onSubmitRequest={handleSubmitRequest}
                />
              )}

              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="button"
                  onClick={openPasswordModal}
                  className="w-full rounded-md bg-client-text text-client-primary py-2 font-semibold hover:bg-client-textPlaceholder transition"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalChangePassword
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onConfirmRequest={handlePasswordChange}
      />

      <ModalConfirmation
        isOpen={showConfirmModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmar actualización"
        message="¿Estás seguro de que deseas actualizar tus datos personales?"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        confirmClassName="bg-client-accent hover:bg-client-accentHover"
      />
    </section>
  );
}
