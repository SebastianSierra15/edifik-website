import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { InternalServerError } from "@/src/shared";
import { PasswordRepository } from "../domain/PasswordRepository";

export class MysqlPasswordRepository implements PasswordRepository {
  async setTemporaryPassword(email: string, hash: string): Promise<void> {
    await db.query("CALL set_temporary_password(?, ?)", [email, hash]);
  }

  async getUserPasswordHash(userId: number): Promise<string> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_password(?)",
      [userId]
    );

    const row = result[0]?.[0];
    if (!row) {
      throw new InternalServerError(
        "No se pudo obtener la contraseña del usuario"
      );
    }

    return row.password;
  }

  async changePassword(userId: number, hash: string): Promise<void> {
    await db.query("CALL changed_password(?, ?)", [userId, hash]);
  }
}
