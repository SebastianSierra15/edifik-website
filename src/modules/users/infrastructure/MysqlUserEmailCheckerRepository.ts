import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { UserEmailCheckResult } from "@/src/interfaces";
import { UserEmailCheckerRepository } from "../domain/UserRepository";

export class MysqlUserEmailCheckerRepository
  implements UserEmailCheckerRepository
{
  async check(email: string): Promise<UserEmailCheckResult> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL check_user_email(?)",
      [email]
    );

    if (!result || result.length === 0 || result[0].length === 0) {
      return { id: null };
    }

    const row = result[0][0] as { id: number };

    return { id: row.id };
  }
}
