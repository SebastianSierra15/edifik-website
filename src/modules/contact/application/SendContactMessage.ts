import { BadRequestError } from "@/src/shared";
import { ContactMessage, ContactEmailSender } from "../domain/ContactMessage";

export class SendContactMessage {
  constructor(private readonly sender: ContactEmailSender) {}

  async execute(input: { toEmail: string; message: ContactMessage }) {
    const { toEmail, message } = input;

    if (!toEmail || !message.email || !message.message || !message.name) {
      throw new BadRequestError("Datos de contacto incompletos");
    }

    if (!toEmail.includes("@")) {
      throw new BadRequestError("El correo de destino no es válido");
    }

    if (!message.email.includes("@")) {
      throw new BadRequestError("El correo del remitente no es válido");
    }

    await this.sender.sendContactMessage(toEmail, message);

    return { ok: true };
  }
}
