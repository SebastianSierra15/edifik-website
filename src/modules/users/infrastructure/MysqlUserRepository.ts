import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { UserRepository } from "../domain/UserRepository";
import { CreateUserInput } from "../domain/CreateUserInput";
import { UpdateUserInput } from "../domain/UpdateUserInput";
import { User } from "@/src/interfaces";

export class MysqlUserRepository implements UserRepository {
  async findPaginated({
    page,
    pageSize,
    searchTerm,
  }: {
    page: number;
    pageSize: number;
    searchTerm: string | null;
  }) {
    const safeSearchTerm = searchTerm ? escapeSearchTerm(searchTerm) : null;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_users(?, ?, ?)",
      [page, pageSize, safeSearchTerm]
    );

    const rows = Array.isArray(result[0]) ? result[0] : [];
    const totalEntriesRow =
      Array.isArray(result[1]) && result[1].length > 0 ? result[1][0] : null;

    const users: User[] = rows.map((row: any) => ({
      id: row.id,
      names: row.names,
      lastnames: row.lastnames,
      email: row.email,
      phoneNumber: row.phoneNumber,
      state: row.state,
      registrationDate: row.registrationDate,
      lastLogin: row.lastLogin,
      totalProperties: row.totalProperties,
      provider: row.providerName,
      gender: {
        id: row.genderId,
        name: row.genderName,
      },
      role: {
        id: row.roleId,
        name: row.roleName,
      },
      membership: {
        id: row.membershipId,
        name: row.membershipName,
      },
    }));

    return {
      users,
      totalEntries: totalEntriesRow?.totalEntries ?? 0,
    };
  }

  async create(input: CreateUserInput): Promise<void> {
    await db.query("CALL insert_user(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      input.names,
      input.lastnames,
      input.email,
      input.phoneNumber ?? null,
      input.genderId,
      input.roleId,
      input.membershipId ?? "1001",
      input.state,
      input.createdBy,
    ]);
  }

  async update(input: UpdateUserInput): Promise<void> {
    await db.query("CALL update_user_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      input.id,
      input.names,
      input.lastnames,
      input.email,
      input.phoneNumber ?? null,
      input.state,
      input.genderId,
      input.roleId,
      input.membershipId ?? "1001",
      input.updatedBy,
    ]);
  }
}
