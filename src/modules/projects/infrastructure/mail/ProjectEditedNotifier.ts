import { EmailSender, buildDefaultEmailTemplate } from "@/src/modules";

export class ProjectEditedNotifier {
  constructor(private readonly emailSender: EmailSender) {}

  async notify(data: { projectName: string; ownerEmail: string }) {
    const html = buildDefaultEmailTemplate({
      title: "Propiedad Editada en EdifiK",
      intro: "Una propiedad ha sido modificada recientemente en la plataforma.",
      items: [
        { label: "Nombre de la Propiedad", value: data.projectName },
        { label: "Propietario", value: data.ownerEmail },
      ],
      buttonText: "Ver solicitudes",
      buttonUrl: "https://edifik.co/admin/solicitudes",
    });

    await this.emailSender.send(
      process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "",
      "Propiedad Editada en EdifiK",
      html
    );
  }
}
