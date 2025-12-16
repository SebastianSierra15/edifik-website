import { db } from "@/lib/db";
import { UpdateRequestStatusRepository } from "../domain/RequestRepository";

export class MysqlUpdateRequestStatusRepository
  implements UpdateRequestStatusRepository
{
  async updateStatus({
    id,
    statusId,
    responseMessage,
    reviewerId,
  }: {
    id: number;
    statusId: number;
    responseMessage: string;
    reviewerId: number;
  }): Promise<void> {
    await db.query("CALL update_request(?, ?, ?, ?)", [
      id,
      statusId,
      responseMessage,
      reviewerId,
    ]);
  }
}
