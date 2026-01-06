import { BadRequestError } from "@/src/shared";
import { UpdateRequestStatusRepository } from "../domain/RequestRepository";
import { RequestStatus } from "../domain/Request";

export class UpdateRequestStatus {
  constructor(private readonly repo: UpdateRequestStatusRepository) {}

  async execute(input: {
    id: number;
    statusId: RequestStatus;
    responseMessage: string;
    reviewerId: number;
  }) {
    const { id, statusId, responseMessage, reviewerId } = input;

    if (!id || !statusId || !responseMessage) {
      throw new BadRequestError("Faltan datos obligatorios");
    }

    await this.repo.updateStatus({
      id,
      statusId,
      responseMessage,
      reviewerId,
    });

    return { message: "Solicitud actualizada correctamente" };
  }
}
