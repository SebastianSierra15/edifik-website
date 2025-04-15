import type { Metadata } from "next";
import ClientForgetPasswordPage from "@/app/ui/login/clientForgetPasswordPage";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | EdifiK",
  description:
    "Recupera el acceso a tu cuenta en EdifiK ingresando tu correo electrónico registrado.",
};

export default function RecoverPasswordPage() {
  return <ClientForgetPasswordPage />;
}
