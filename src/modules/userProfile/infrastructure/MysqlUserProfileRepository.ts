import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Gender } from "@/src/interfaces";
import { UserProfileRepository } from "../domain/UserProfileRepository";
import { UserProfile } from "../domain/UserProfile";

export class MysqlUserProfileRepository implements UserProfileRepository {
  async getProfile(userId: number) {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_profile(?)",
      [userId]
    );

    const userRow = result[0]?.[0];
    const genderRows = result[1] ?? [];

    const user: UserProfile = {
      id: userRow.id,
      identityDocument: userRow.identityDocument,
      names: userRow.names,
      lastnames: userRow.lastnames,
      birthdate: userRow.birthdate ? new Date(userRow.birthdate) : undefined,
      email: userRow.email,
      phoneNumber: userRow.phoneNumber,
      gender: userRow.genderId
        ? { id: userRow.genderId, name: userRow.genderName }
        : undefined,
      provider: userRow.providerId,
    };

    const genders: Gender[] = (genderRows as RowDataPacket[]).map((row) => ({
      id: row.genderId,
      name: row.genderName,
    }));

    return { user, genders };
  }

  async updateProfile(
    userId: number,
    data: Parameters<UserProfileRepository["updateProfile"]>[1]
  ): Promise<void> {
    // Normalizar la fecha antes de enviarla
    const birthdate = data.birthdate
      ? new Date(data.birthdate).toISOString().slice(0, 19).replace("T", " ")
      : null;

    await db.query("CALL update_user_profile(?, ?, ?, ?, ?, ?, ?)", [
      userId,
      data.identityDocument,
      data.names,
      data.lastnames,
      birthdate,
      data.phoneNumber,
      data.genderId ?? null,
    ]);
  }
}
