import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { GetRequestsRepository } from "../domain/RequestRepository";
import { Request } from "../domain/Request";

export class MysqlGetRequestsRepository implements GetRequestsRepository {
  async getAll({
    page,
    pageSize,
    searchTerm,
  }: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }) {
    const safeSearchTerm = escapeSearchTerm(searchTerm ?? null);

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_requests(?, ?, ?)",
      [page, pageSize, safeSearchTerm]
    );

    const [rows = [], [totalRow] = []] = result;

    return {
      requests: rows as Request[],
      totalEntries: totalRow?.totalEntries || 0,
    };
  }
}
