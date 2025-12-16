import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { PendingRequestRepository } from "../domain/RequestRepository";
import { PendingRequest } from "../domain/Request";

export class MysqlPendingRequestRepository implements PendingRequestRepository {
  async getPending(): Promise<PendingRequest[]> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_pending_requests()"
    );

    return (result[0] ?? []) as PendingRequest[];
  }
}
