import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { UserEmailRepository } from "../domain/UserRepository";
import { UserEmail } from "@/src/interfaces";

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

    return (result[0] as any[]).map((row) => ({
      id: row.id,
      email: row.email,
    }));
  }
}
