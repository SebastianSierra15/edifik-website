import { UpdateRequestStatus } from "../application/UpdateRequestStatus";
import { MysqlUpdateRequestStatusRepository } from "../infrastructure/MysqlUpdateRequestStatusRepository";
import { NodemailerEmailSender } from "../../shared";
import { RequestStatusEmailTemplate } from "../infrastructure/RequestStatusEmailTemplate";
import { RequestStatus } from "../domain/Request";

export async function updateRequestController(input: {
  id: number;
  statusId: RequestStatus;
  responseMessage: string;
  reviewerId: number;
  userEmail: string;
}) {
  const useCase = new UpdateRequestStatus(
    new MysqlUpdateRequestStatusRepository()
  );
  const result = await useCase.execute(input);

  const template = new RequestStatusEmailTemplate();
  const html = template.build(input.statusId, input.responseMessage);

  await new NodemailerEmailSender().send(
    input.userEmail,
    "Actualización de solicitud",
    html
  );

  return result;
}
