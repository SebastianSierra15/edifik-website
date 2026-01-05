import { buildDefaultEmailTemplate } from "@/src/modules/shared";
import { RequestStatus } from "../domain/Request";
import { BRAND } from "@/src/config";

export class RequestStatusEmailTemplate {
  build(status: RequestStatus, responseMessage: string) {
    const statusMap: Record<RequestStatus, string> = {
      [RequestStatus.Approved]: "aprobada",
      [RequestStatus.Rejected]: "rechazada",
      [RequestStatus.Review]: "enviada a revisión",
    };

    const statusName = statusMap[status];

    return buildDefaultEmailTemplate({
      title: `Tu solicitud ha sido ${statusName}`,
      greeting: "Hola,",
      intro: `Hemos revisado tu solicitud y ha sido <strong>${statusName}</strong>.`,
      body: `<strong>Respuesta del revisor:</strong> ${responseMessage}`,
      buttonText: "Ver mis propiedades",
      buttonUrl: `${BRAND.appUrl}/usuario/mis-propiedades`,
    });
  }
}
