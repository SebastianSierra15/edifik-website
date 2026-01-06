import { BRAND } from "@/src/config";
import { EmailSender, buildDefaultEmailTemplate } from "@/src/modules/shared";

export class ProjectCreatedNotifier {
  constructor(private readonly emailSender: EmailSender) {}

  async notify(data: {
    projectName: string;
    ownerEmail: string;
  }): Promise<void> {
    const html = buildDefaultEmailTemplate({
      title: "Nueva Propiedad Registrada",
      intro: `Se ha registrado una nueva propiedad en la plataforma ${BRAND.name}.`,
      items: [
        { label: "Nombre de la Propiedad", value: data.projectName },
        { label: "Propietario", value: data.ownerEmail },
      ],
      body: "Le recomendamos revisar y validar la información en el sistema administrativo.",
      buttonText: "Ver solicitudes",
      buttonUrl: `${BRAND.appUrl}/admin/solicitudes`,
    });

    await this.emailSender.send(
      process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "",
      `Nueva Propiedad Registrada en ${BRAND.name}`,
      html
    );
  }
}
