import { buildDefaultEmailTemplate } from "../../shared";
import { ContactEmailSender } from "../domain/ContactMessage";
import { ContactMessage } from "../domain/ContactMessage";
import { NodemailerEmailSender } from "../../shared";

export class NodemailerContactEmailSender implements ContactEmailSender {
  private readonly emailSender = new NodemailerEmailSender();

  async sendContactMessage(to: string, message: ContactMessage): Promise<void> {
    const html = buildDefaultEmailTemplate({
      title: "Nuevo mensaje de contacto",
      intro:
        "Has recibido un nuevo mensaje a través del formulario de contacto.",
      items: [
        { label: "Nombre", value: message.name },
        { label: "Teléfono", value: message.phone ?? "-" },
        { label: "Correo", value: message.email },
        { label: "Mensaje", value: message.message },
      ],
    });

    await this.emailSender.send(to, "Nuevo mensaje de contacto", html);
  }
}
