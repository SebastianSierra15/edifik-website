import { buildDefaultEmailTemplate } from "../../shared";

export class PasswordRecoveryEmailTemplate {
  build(code: string): string {
    return buildDefaultEmailTemplate({
      title: "Código de recuperación de contraseña",
      greeting: "Hola,",
      intro: "Hemos recibido una solicitud para restablecer tu contraseña.",
      items: [{ label: "Código temporal", value: code }],
      body: "Usa este código como contraseña temporal para iniciar sesión. Una vez dentro, podrás cambiar tu contraseña desde tu perfil.",
      buttonText: "Ir a iniciar sesión",
      buttonUrl: "https://edifik.co/login",
    });
  }
}
