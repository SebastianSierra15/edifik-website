import { db } from "@/lib/db";
import { RegisterUserRepository } from "../domain/RegisterUserRepository";

export class MysqlRegisterUserRepository implements RegisterUserRepository {
  async register(data: {
    names: string;
    lastnames: string;
    birthdate: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
  }): Promise<void> {
    const { names, lastnames, birthdate, email, phoneNumber, passwordHash } =
      data;

    await db.query("CALL register_user(?, ?, ?, ?, ?, ?)", [
      names,
      lastnames,
      birthdate,
      email,
      phoneNumber,
      passwordHash,
    ]);
  }
}
