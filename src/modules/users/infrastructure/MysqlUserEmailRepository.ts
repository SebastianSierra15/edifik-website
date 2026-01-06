import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { UserEmail } from "@/src/interfaces";
import { escapeSearchTerm } from "@/utils";
import { UserEmailRepository } from "../domain/UserRepository";

export class MysqlUserEmailRepository implements UserEmailRepository {
  async searchByEmail(term: string): Promise<UserEmail[]> {
    const safeTerm = escapeSearchTerm(term);

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL search_user_emails(?)",
      [safeTerm]
    );

    if (!result || result.length === 0) {
      return [];
    }

    const rows = result[0] as RowDataPacket[];

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
    }));
  }
}
