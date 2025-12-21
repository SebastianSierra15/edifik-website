import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Membership } from "@/src/interfaces";
import { escapeSearchTerm } from "@/utils";
import { GetMembershipsRepository } from "../domain/MembershipRepository";

export class MysqlGetMembershipsRepository implements GetMembershipsRepository {
  async getAll({ page, pageSize, searchTerm }: any) {
    const safeSearchTerm = escapeSearchTerm(searchTerm ?? null);

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_memberships(?, ?, ?)",
      [page, pageSize, safeSearchTerm]
    );

    const [rows = [], [totalRow] = []] = result;

    return {
      memberships: rows as Membership[],
      totalEntries: totalRow?.totalEntries ?? 0,
    };
  }
}
