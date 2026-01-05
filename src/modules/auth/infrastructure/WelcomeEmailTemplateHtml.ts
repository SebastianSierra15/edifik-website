import { BRAND } from "@/src/config";
import { buildDefaultEmailTemplate } from "../../shared";
import { WelcomeEmailTemplate } from "../domain/WelcomeEmailTemplate";

export class WelcomeEmailTemplateHtml implements WelcomeEmailTemplate {
  build({
    names,
    email,
    phoneNumber,
  }: {
    names: string;
    email: string;
    phoneNumber: string;
  }): string {
    return buildDefaultEmailTemplate({
      title: "¡Tu cuenta ha sido creada exitosamente!",
      greeting: `Hola ${names},`,
      intro: `Gracias por registrarte en ${BRAND.name}. Tu cuenta ha sido creada con éxito.`,
      items: [
        { label: "Correo electrónico", value: email },
        { label: "Teléfono", value: phoneNumber },
      ],
      body: "Ahora puedes acceder a tu cuenta y empezar a explorar nuestras funcionalidades.",
      buttonText: "Iniciar sesión",
      buttonUrl: `${BRAND.appUrl}/auth/login`,
    });
  }
}
