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
      intro:
        "Gracias por registrarte en EdifiK. Tu cuenta ha sido creada con éxito.",
      items: [
        { label: "Correo electrónico", value: email },
        { label: "Teléfono", value: phoneNumber },
      ],
      body: "Ahora puedes acceder a tu cuenta y empezar a explorar nuestras funcionalidades.",
      buttonText: "Iniciar sesión",
      buttonUrl: "https://edifik.co/login",
    });
  }
}
