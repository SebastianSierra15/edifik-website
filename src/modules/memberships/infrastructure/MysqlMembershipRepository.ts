import { MembershipRepository } from "../domain/MembershipRepository";
import { UpdateMembershipDTO } from "../application/dto/UpdateMembershipDTO";
import { db } from "@/lib/db";

export class MysqlMembershipRepository implements MembershipRepository {
  async update(dto: UpdateMembershipDTO): Promise<void> {
    const { id, name, price, durationMonths, isActive } = dto;

    await db.query("CALL update_membership(?, ?, ?, ?, ?)", [
      id,
      name,
      price,
      durationMonths,
      isActive,
    ]);
  }
}
