import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/src/components/auth";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | EdifiK",
  description:
    "Recupera el acceso a tu cuenta en EdifiK ingresando tu correo electrónico registrado.",
};

export default function RecoverPasswordPage() {
  return <ForgotPasswordPage />;
}
