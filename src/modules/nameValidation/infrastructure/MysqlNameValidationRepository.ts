import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NameValidationRepository } from "../domain/NameValidationRepository";
import { NameValidationTarget } from "../domain/NameValidationTarget";

export class MysqlNameValidationRepository implements NameValidationRepository {
  async countByName({
    target,
    name,
    excludeId,
  }: {
    target: NameValidationTarget;
    name: string;
    excludeId?: number | null;
  }): Promise<number> {
    const procedureMap: Record<NameValidationTarget, string> = {
      [NameValidationTarget.Role]: "check_role_name",
      [NameValidationTarget.Project]: "check_project_name",
      [NameValidationTarget.Category]: "check_category_name",
    };

    const procedure = procedureMap[target];

    const [result] = await db.query<RowDataPacket[][]>(
      `CALL ${procedure}(?, ?)`,
      [excludeId ?? null, name]
    );

    return (result[0]?.[0]?.total as number) || 0;
  }
}
