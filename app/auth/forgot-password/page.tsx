import type { Metadata } from "next";
import { BRAND } from "@/src/config";
import { ForgotPasswordPage } from "@/src/components/auth";

export const metadata: Metadata = {
  title: `Recuperar Contraseña | ${BRAND.name}`,
  description: `Recupera el acceso a tu cuenta en ${BRAND.name} ingresando tu correo electrónico registrado.`,
};

export default function RecoverPasswordPage() {
  return <ForgotPasswordPage />;
}
